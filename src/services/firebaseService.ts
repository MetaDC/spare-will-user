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
  Unsubscribe
} from 'firebase/firestore';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  updateProfile as fbUpdateProfile,
  onAuthStateChanged,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { db, auth } from '../lib/firebase';
import { Inquiry, UserProfile, VehicleInfo, BusinessSettings, SparePart } from '../types';


const INQUIRIES_COLLECTION = 'inquiries';
const USERS_COLLECTION = 'users';
const SAVED_VEHICLES_COLLECTION = 'savedVehicles';

/**
 * Listen to real-time updates for all inquiries or seed initial data if empty.
 */
export function subscribeToInquiries(
  userId: string | undefined,
  onData: (inquiries: Inquiry[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const inquiriesRef = collection(db, INQUIRIES_COLLECTION);
  const q = userId 
    ? query(inquiriesRef, where('userId', '==', userId))
    : query(inquiriesRef, where('userId', '==', 'UNAUTHENTICATED')); // Prevent fetching all if logged out

  return onSnapshot(
    q,
    async (snapshot) => {
      const items: Inquiry[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as Inquiry);
      });
      // Sort newest first
      items.sort((a, b) => (b.id > a.id ? 1 : -1));
      onData(items);
    },
    (err) => {
      console.warn('Inquiries subscription error:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Save / update an inquiry in Firestore
 */
export async function saveInquiryToFirestore(inquiry: Inquiry): Promise<void> {
  const docRef = doc(db, INQUIRIES_COLLECTION, inquiry.id);
  await setDoc(docRef, {
    ...inquiry,
    createdAt: new Date().toISOString(),
    serverTime: serverTimestamp()
  }, { merge: true });
}

/**
 * Save user profile to Firestore
 */
export async function saveUserProfileToFirestore(user: UserProfile): Promise<void> {
  const docRef = doc(db, USERS_COLLECTION, user.id);
  await setDoc(docRef, {
    ...user,
    updatedAt: new Date().toISOString()
  }, { merge: true });
}

/**
 * Fetch a user profile from Firestore
 */
export async function getUserProfileFromFirestore(userId: string): Promise<UserProfile | null> {
  try {
    const docRef = doc(db, USERS_COLLECTION, userId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
  } catch (e) {
    console.warn('Failed to get user profile from Firestore:', e);
  }
  return null;
}

/**
 * Firebase Auth Helpers
 */
export async function firebaseSignIn(email: string, password: string = 'password123'): Promise<UserProfile> {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const fbUser = cred.user;
  const existing = await getUserProfileFromFirestore(fbUser.uid);
  if (existing) return existing;

  const profile: UserProfile = {
    id: fbUser.uid,
    name: fbUser.displayName || email.split('@')[0] || 'Valued Customer',
    email: fbUser.email || email,
    phone: '',
    avatar: ''
  };
  await saveUserProfileToFirestore(profile);
  return profile;
}

export async function firebaseSignUp(name: string, email: string, password: string = 'password123'): Promise<UserProfile> {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const fbUser = cred.user;
  
  if (name) {
    await fbUpdateProfile(fbUser, { displayName: name });
  }

  const profile: UserProfile = {
    id: fbUser.uid,
    name: name || 'Customer',
    email: email,
    phone: '',
    avatar: ''
  };

  await saveUserProfileToFirestore(profile);
  return profile;
}

export async function firebaseSignOut(): Promise<void> {
  await fbSignOut(auth);
}

export async function firebaseSignInWithGoogle(): Promise<UserProfile> {
  const provider = new GoogleAuthProvider();
  const cred = await signInWithPopup(auth, provider);
  const fbUser = cred.user;
  const existing = await getUserProfileFromFirestore(fbUser.uid);
  if (existing) return existing;

  const profile: UserProfile = {
    id: fbUser.uid,
    name: fbUser.displayName || 'Google User',
    email: fbUser.email || '',
    phone: '',
    avatar: fbUser.photoURL || ''
  };
  await saveUserProfileToFirestore(profile);
  return profile;
}

export function subscribeToAuth(onUser: (user: FirebaseUser | null) => void): Unsubscribe {
  return onAuthStateChanged(auth, onUser);
}

/**
 * Subscribe to business settings (settings/business) — written by the admin panel.
 */
export function subscribeToBusinessSettings(
  onData: (settings: BusinessSettings) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const docRef = doc(db, 'settings', 'business');
  return onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        onData(snap.data() as BusinessSettings);
      }
    },
    (err) => {
      console.warn('Business settings subscription error:', err);
      onError?.(err);
    }
  );
}

/**
 * Subscribe to the spare parts inventory — written by the admin panel.
 */
export function subscribeToInventory(
  onData: (parts: SparePart[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const q = query(collection(db, 'inventory'), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snap) => {
      const items: SparePart[] = snap.docs.map(d => ({ ...d.data(), id: d.id } as SparePart));
      onData(items);
    },
    (err) => {
      console.warn('Inventory subscription error:', err);
      onError?.(err);
    }
  );
}
