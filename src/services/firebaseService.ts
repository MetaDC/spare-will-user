import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  serverTimestamp,
  runTransaction,
  Unsubscribe,
} from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  updateProfile as fbUpdateProfile,
  onAuthStateChanged,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { db, auth } from "../lib/firebase";
import {
  Inquiry,
  UserProfile,
  VehicleInfo,
  BusinessSettings,
  SparePart,
} from "../types";

const INQUIRIES_COLLECTION = "inquiries";
const USERS_COLLECTION = "users";
const SAVED_VEHICLES_COLLECTION = "savedVehicles";

/**
 * Parse any timestamp representation (Firestore Timestamp, Date, ISO string, milliseconds) to epoch ms.
 */
export function getTimestampMs(val: any): number {
  if (!val) return 0;
  if (typeof val.toMillis === "function") return val.toMillis();
  if (typeof val.toDate === "function") return val.toDate().getTime();
  if (val.seconds) return val.seconds * 1000;
  if (val instanceof Date) return val.getTime();
  if (typeof val === "string" || typeof val === "number") {
    const ms = new Date(val).getTime();
    return isNaN(ms) ? 0 : ms;
  }
  return 0;
}

/**
 * Format inquiry date from createdAt timestamp (Firestore serverTimestamp / Timestamp / Date / string / ms).
 */
export function formatInquiryDate(createdAt: any): string {
  if (!createdAt) return "Recently";

  let d: Date | null = null;
  if (typeof createdAt?.toDate === "function") {
    d = createdAt.toDate();
  } else if (createdAt?.seconds) {
    d = new Date(createdAt.seconds * 1000);
  } else if (createdAt instanceof Date) {
    d = createdAt;
  } else if (typeof createdAt === "string" || typeof createdAt === "number") {
    const parsed = new Date(createdAt);
    if (!isNaN(parsed.getTime())) d = parsed;
  }

  if (d) {
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return "Recently";
}

/**
 * Listen to real-time updates for all inquiries or seed initial data if empty.
 */
export function subscribeToInquiries(
  userId: string | undefined,
  onData: (inquiries: Inquiry[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  const inquiriesRef = collection(db, INQUIRIES_COLLECTION);
  const q = userId
    ? query(inquiriesRef, where("userId", "==", userId))
    : query(inquiriesRef, where("userId", "==", "UNAUTHENTICATED")); // Prevent fetching all if logged out

  return onSnapshot(
    q,
    async (snapshot) => {
      const items: Inquiry[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ ...docSnap.data(), id: docSnap.id } as Inquiry);
      });
      // Sort newest first by creation timestamp
      items.sort(
        (a, b) => getTimestampMs(b.createdAt) - getTimestampMs(a.createdAt),
      );
      onData(items);
    },
    (err) => {
      console.warn("Inquiries subscription error:", err);
      if (onError) onError(err);
    },
  );
}

/**
 * Save / create an inquiry in Firestore.
 * Atomically increments `inquiryCount` in `Setting/sets` and generates sequential `inquireId` (SW001, SW002...).
 * Preserves the original `id` and Firestore document ID without modification.
 */
export async function saveInquiryToFirestore(
  inquiry: Inquiry,
): Promise<{ id: string; inquireId: string }> {
  const docRef = inquiry.id
    ? doc(db, INQUIRIES_COLLECTION, inquiry.id)
    : doc(collection(db, INQUIRIES_COLLECTION));

  const settingRef = doc(db, "Setting", "sets");
  const { date, serverTime, createdAt, InquireID, ...dataToSave } = inquiry as any;

  let assignedInquireId = inquiry.inquireId || inquiry.InquireID;

  if (!assignedInquireId) {
    try {
      assignedInquireId = await runTransaction(db, async (transaction) => {
        const settingSnap = await transaction.get(settingRef);
        let count = 0;
        if (settingSnap.exists()) {
          const settingData = settingSnap.data();
          count =
            typeof settingData.inquiryCount === "number"
              ? settingData.inquiryCount
              : 0;
        }
        const nextCount = count + 1;
        const generatedInquireId = `SW${String(nextCount).padStart(3, "0")}`;

        // Atomically update inquiryCount in Setting/sets
        transaction.set(
          settingRef,
          {
            inquiryCount: nextCount,
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        );

        // Save inquiry with newly generated inquireId (only save inquireId)
        transaction.set(
          docRef,
          {
            ...dataToSave,
            id: docRef.id,
            inquireId: generatedInquireId,
            createdAt: serverTimestamp(),
          },
          { merge: true },
        );

        return generatedInquireId;
      });
    } catch (e) {
      console.warn(
        "Transaction failed, saving with fallback sequential ID:",
        e,
      );
      const fallbackId = `SW${Math.floor(100 + Math.random() * 900)}`;
      await setDoc(
        docRef,
        {
          ...dataToSave,
          id: docRef.id,
          inquireId: fallbackId,
          createdAt: serverTimestamp(),
        },
        { merge: true },
      );
      assignedInquireId = fallbackId;
    }
  } else {
    // If inquireId already exists, keep only inquireId
    await setDoc(
      docRef,
      {
        ...dataToSave,
        id: docRef.id,
        inquireId: assignedInquireId,
        createdAt: serverTimestamp(),
      },
      { merge: true },
    );
  }

  return { id: docRef.id, inquireId: assignedInquireId || docRef.id };
}

/**
 * Save user profile to Firestore with serverTimestamp
 */
export async function saveUserProfileToFirestore(
  user: UserProfile,
): Promise<void> {
  const docRef = doc(db, USERS_COLLECTION, user.id);
  const snap = await getDoc(docRef);

  if (!snap.exists()) {
    await setDoc(
      docRef,
      {
        ...user,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  } else {
    const existingData = snap.data();
    await setDoc(
      docRef,
      {
        ...user,
        createdAt: existingData?.createdAt || serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  }
}

/**
 * Fetch a user profile from Firestore
 */
export async function getUserProfileFromFirestore(
  userId: string,
): Promise<UserProfile | null> {
  try {
    const docRef = doc(db, USERS_COLLECTION, userId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as UserProfile;
    }
  } catch (e) {
    console.warn("Failed to get user profile from Firestore:", e);
  }
  return null;
}

/**
 * Firebase Auth Helpers:
 * When user logs in, check if auth id has same document in user collection.
 * If not, create it with createdAt and updatedAt as serverTimestamp.
 */
export async function firebaseSignIn(
  email: string,
  password: string = "password123",
): Promise<UserProfile> {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const fbUser = cred.user;

  // Check if document exists in 'users' collection with doc ID = fbUser.uid
  const userDocRef = doc(db, USERS_COLLECTION, fbUser.uid);
  const snap = await getDoc(userDocRef);

  if (snap.exists()) {
    const existing = { id: snap.id, ...snap.data() } as UserProfile;
    // Update updatedAt timestamp on login
    await setDoc(userDocRef, { updatedAt: serverTimestamp() }, { merge: true });
    return existing;
  }

  // Document does not exist in 'users' collection -> create it on login!
  const profile: UserProfile = {
    id: fbUser.uid,
    name: fbUser.displayName || email.split("@")[0] || "Valued Customer",
    email: fbUser.email || email,
    phone: "",
    avatar: fbUser.photoURL || "",
  };

  await setDoc(
    userDocRef,
    {
      ...profile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  return profile;
}

export async function firebaseSignUp(
  name: string,
  email: string,
  password: string = "password123",
): Promise<UserProfile> {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const fbUser = cred.user;

  if (name) {
    await fbUpdateProfile(fbUser, { displayName: name });
  }

  const userDocRef = doc(db, USERS_COLLECTION, fbUser.uid);
  const profile: UserProfile = {
    id: fbUser.uid,
    name: name || "Customer",
    email: email,
    phone: "",
    avatar: "",
  };

  await setDoc(
    userDocRef,
    {
      ...profile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  return profile;
}

export async function firebaseSignOut(): Promise<void> {
  await fbSignOut(auth);
}

export async function firebaseSignInWithGoogle(): Promise<UserProfile> {
  const provider = new GoogleAuthProvider();
  const cred = await signInWithPopup(auth, provider);
  const fbUser = cred.user;

  // Check if document exists in 'users' collection with doc ID = fbUser.uid
  const userDocRef = doc(db, USERS_COLLECTION, fbUser.uid);
  const snap = await getDoc(userDocRef);

  if (snap.exists()) {
    const existing = { id: snap.id, ...snap.data() } as UserProfile;
    await setDoc(userDocRef, { updatedAt: serverTimestamp() }, { merge: true });
    return existing;
  }

  // Document does not exist in 'users' collection -> create it on login!
  const profile: UserProfile = {
    id: fbUser.uid,
    name: fbUser.displayName || "Google User",
    email: fbUser.email || "",
    phone: "",
    avatar: fbUser.photoURL || "",
  };

  await setDoc(
    userDocRef,
    {
      ...profile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  return profile;
}

export async function ensureUserProfileInFirestore(
  fbUser: FirebaseUser,
): Promise<UserProfile> {
  const userDocRef = doc(db, USERS_COLLECTION, fbUser.uid);
  const snap = await getDoc(userDocRef);

  if (snap.exists()) {
    const existing = { id: snap.id, ...snap.data() } as UserProfile;
    await setDoc(userDocRef, { updatedAt: serverTimestamp() }, { merge: true });
    return existing;
  }

  // Document does not exist in 'users' collection -> create it on login!
  const profile: UserProfile = {
    id: fbUser.uid,
    name:
      fbUser.displayName || fbUser.email?.split("@")[0] || "Valued Customer",
    email: fbUser.email || "",
    phone: "",
    avatar: fbUser.photoURL || "",
  };

  await setDoc(
    userDocRef,
    {
      ...profile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  return profile;
}

export function subscribeToAuth(
  onUser: (user: FirebaseUser | null) => void,
): Unsubscribe {
  return onAuthStateChanged(auth, onUser);
}

/**
 * Subscribe to business settings (Setting/sets) — written by the admin panel.
 */
export function subscribeToBusinessSettings(
  onData: (settings: BusinessSettings) => void,
  onError?: (err: Error) => void,
): Unsubscribe {
  const docRef = doc(db, "Setting", "sets");
  return onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        onData({
          businessName: d.businessName || "Spare Will",
          businessEmail: d.businessEmail || "",
          callingNumber: d.businessCallingNumber || d.callingNumber || "",
          whatsappNumber: d.whatsappNumber || "",
          defaultGreeting: d.defaultGreetingMsg || d.defaultGreeting || "",
        });
      } else {
        // Fallback to legacy document if Setting/sets is not yet initialized
        const legacyRef = doc(db, "settings", "business");
        getDoc(legacyRef)
          .then((s) => {
            if (s.exists()) {
              onData(s.data() as BusinessSettings);
            }
          })
          .catch((e) => console.warn("Fallback settings error:", e));
      }
    },
    (err) => {
      console.warn("Business settings subscription error:", err);
      onError?.(err);
    },
  );
}

// /**
//  * Subscribe to the spare parts inventory — written by the admin panel.
//  * (Deprecated: user app now queries part_subcategories and part_categories directly)
//  */
// export function subscribeToInventory(
//   onData: (parts: SparePart[]) => void,
//   onError?: (err: Error) => void
// ): Unsubscribe {
//   const q = query(collection(db, 'inventory'), orderBy('createdAt', 'desc'));
//   return onSnapshot(
//     q,
//     (snap) => {
//       const items: SparePart[] = snap.docs.map(d => ({ ...d.data(), id: d.id } as SparePart));
//       onData(items);
//     },
//     (err) => {
//       console.warn('Inventory subscription error:', err);
//       onError?.(err);
//     }
//   );
// }
