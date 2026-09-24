import React, { createContext, useContext, useState, useEffect } from "react";
import {
  ContactInfo,
  Inquiry,
  PartItem,
  Screen,
  UserProfile,
  VehicleInfo,
  BusinessSettings,
  SparePart,
} from "../types";
// import { DUMMY_INVENTORY } from "../data/mockData";
import { collection, doc } from "firebase/firestore";
import { db } from "../lib/firebase";
import {
  subscribeToInquiries,
  saveInquiryToFirestore,
  saveUserProfileToFirestore,
  firebaseSignIn,
  firebaseSignUp,
  firebaseSignOut,
  firebaseSignInWithGoogle,
  subscribeToAuth,
  subscribeToBusinessSettings,
  // subscribeToInventory,
} from "../services/firebaseService";

interface ToastState {
  message: string;
  type: "success" | "info" | "error";
}

interface ContactActionModal {
  type: "call" | "whatsapp";
  serviceTitle: string;
  phoneNumber: string;
}

interface AppContextType {
  currentScreen: Screen;
  screenHistory: Screen[];
  navigate: (
    screen: Screen,
    params?: { inquiryId?: string; partQuery?: string },
  ) => void;
  goBack: () => void;
  currentUser: UserProfile | null;
  signIn: (email: string, password?: string) => Promise<boolean> | boolean;
  signInWithGoogle: () => Promise<boolean>;
  signUp: (
    name: string,
    email: string,
    password?: string,
  ) => Promise<boolean> | boolean;
  signOut: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;

  // Business settings from admin
  businessSettings: BusinessSettings | null;

  // Inventory from admin
  inventory: SparePart[];

  // Inquiries
  inquiries: Inquiry[];
  activeInquiryId: string | null;
  activeInquiry: Inquiry | null;
  viewInquiry: (id: string) => void;

  // Inquiry Draft State
  draftVehicle: VehicleInfo;
  draftParts: PartItem[];
  draftContact: ContactInfo;
  draftNotes: string;
  partSearchQuery: string;
  setPartSearchQuery: (q: string) => void;
  addDraftPart: (
    name: string,
    spec?: string,
    subcatMeta?: { subcategoryId?: string; categoryId?: string; categoryName?: string },
  ) => void;
  removeDraftPart: (id: string) => void;
  updateDraftPartQuantity: (id: string, quantity: number) => void;
  updateDraftVehicle: (vehicle: VehicleInfo) => void;
  updateDraftContact: (contact: Partial<ContactInfo>) => void;
  setDraftNotes: (notes: string) => void;
  submitInquiry: () => string;
  resetDraft: () => void;

  // Toasts & Modals
  toast: ToastState | null;
  showToast: (message: string, type?: "success" | "info" | "error") => void;
  actionModal: ContactActionModal | null;
  openActionModal: (
    type: "call" | "whatsapp",
    serviceTitle: string,
    phoneNumber?: string,
  ) => void;
  closeActionModal: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  INQUIRIES: "sparewill_inquiries_v2",
  USER: "sparewill_user_v2",
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [screenHistory, setScreenHistory] = useState<Screen[]>(["home"]);
  const [activeInquiryId, setActiveInquiryId] = useState<string | null>(null);

  // Business settings from Firestore (admin-managed)
  const [businessSettings, setBusinessSettings] =
    useState<BusinessSettings | null>(null);

  // Inventory from Firestore (admin-managed)
  const [inventory, setInventory] = useState<SparePart[]>([]);

  // User Authentication State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Inquiries State
  const [inquiries, setInquiries] = useState<Inquiry[]>(() => {
    try {
      const userSaved = localStorage.getItem(STORAGE_KEYS.USER);
      if (!userSaved) return [];
      const saved = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Subscribe to business settings (phone/whatsapp from admin)
  useEffect(() => {
    const unsub = subscribeToBusinessSettings(
      (settings) => setBusinessSettings(settings),
      (err) => console.warn("Business settings error:", err),
    );
    return () => unsub();
  }, []);

  // Inventory subscription disabled — user app now searches part_subcategories and part_categories directly
  // useEffect(() => {
  //   const unsub = subscribeToInventory(
  //     (parts) => setInventory(parts.length > 0 ? parts : DUMMY_INVENTORY),
  //     (err) => {
  //       console.warn("Inventory subscription error, using dummy data:", err);
  //       setInventory(DUMMY_INVENTORY);
  //     },
  //   );
  //   return () => unsub();
  // }, []);


  // Real-time Firebase Firestore Sync for inquiries
  useEffect(() => {
    const unsub = subscribeToInquiries(
      currentUser?.id,
      (firestoreInquiries) => {
        if (firestoreInquiries && firestoreInquiries.length > 0) {
          setInquiries(firestoreInquiries);
          try {
            localStorage.setItem(
              STORAGE_KEYS.INQUIRIES,
              JSON.stringify(firestoreInquiries),
            );
          } catch (e) {
            console.warn("Failed to cache inquiries", e);
          }
        } else if (firestoreInquiries && firestoreInquiries.length === 0) {
          setInquiries([]);
          localStorage.removeItem(STORAGE_KEYS.INQUIRIES);
        }
      },
      (err) => {
        console.warn("Firestore subscription error, using local state:", err);
      },
    );

    return () => unsub();
  }, [currentUser?.id]);

  // Sync auth state
  useEffect(() => {
    const unsub = subscribeToAuth((fbUser) => {
      if (fbUser) {
        const profile: UserProfile = {
          id: fbUser.uid,
          name:
            fbUser.displayName ||
            fbUser.email?.split("@")[0] ||
            "Valued Customer",
          email: fbUser.email || "",
          phone: "",
          avatar: "",
        };
        setCurrentUser(profile);
      }
    });

    return () => unsub();
  }, []);

  // Save to localStorage fallback
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    } catch (e) {
      console.warn("Failed to save user to local storage", e);
    }
  }, [currentUser]);

  // Draft state for spare parts inquiry
  const [draftVehicle, setDraftVehicle] = useState<VehicleInfo>({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    engineTrim: "",
    transmission: "",
    vin: "",
    image: "",
  });
  const [draftParts, setDraftParts] = useState<PartItem[]>([]);
  const [draftContact, setDraftContact] = useState<ContactInfo>({
    fullName: currentUser?.name || "",
    mobileNumber: currentUser?.phone || "",
    whatsappAvailable: true,
    email: currentUser?.email || "",
  });
  const [draftNotes, setDraftNotes] = useState<string>("");
  const [partSearchQuery, setPartSearchQuery] = useState<string>("");

  // Toast & Modals
  const [toast, setToast] = useState<ToastState | null>(null);
  const [actionModal, setActionModal] = useState<ContactActionModal | null>(
    null,
  );

  const showToast = (
    message: string,
    type: "success" | "info" | "error" = "info",
  ) => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const navigate = (
    screen: Screen,
    params?: { inquiryId?: string; partQuery?: string },
  ) => {
    // Auth Guard
    if (
      !currentUser &&
      [
        "profile",
        "edit-profile",
        "inquiries",
        "inquiry-details",
        "review-inquiry",
      ].includes(screen)
    ) {
      showToast("Please sign in to access this page", "info");
      setScreenHistory((prev) => [...prev, screen, "signin"]);
      setCurrentScreen("signin");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (params?.inquiryId) {
      setActiveInquiryId(params.inquiryId);
    }
    if (params?.partQuery !== undefined) {
      setPartSearchQuery(params.partQuery);
    }
    setScreenHistory((prev) => [...prev, screen]);
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    if (screenHistory.length > 1) {
      const newHistory = [...screenHistory];
      newHistory.pop(); // remove current
      const prev = newHistory[newHistory.length - 1];
      setScreenHistory(newHistory);
      setCurrentScreen(prev || "home");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setCurrentScreen("home");
      setScreenHistory(["home"]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const signIn = async (email: string, password: string = "password123") => {
    try {
      const user = await firebaseSignIn(email, password);
      setCurrentUser(user);
      setDraftContact((prev) => ({
        ...prev,
        fullName: user.name,
        email: user.email,
      }));
      showToast(`Welcome back, ${user.name}!`, "success");
      goBack();
      return true;
    } catch (err: any) {
      console.warn("Sign in error:", err);
      showToast(err.message || "Invalid email or password", "error");
      return false;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const user = await firebaseSignInWithGoogle();
      setCurrentUser(user);
      setDraftContact((prev) => ({
        ...prev,
        fullName: user.name,
        email: user.email,
      }));
      showToast(`Welcome, ${user.name}!`, "success");
      goBack();
      return true;
    } catch (err: any) {
      console.warn("Google Sign in error:", err);
      showToast(err.message || "Failed to sign in with Google", "error");
      return false;
    }
  };

  const signUp = async (
    name: string,
    email: string,
    password: string = "password123",
  ) => {
    try {
      const user = await firebaseSignUp(name, email, password);
      setCurrentUser(user);
      setDraftContact((prev) => ({
        ...prev,
        fullName: user.name,
        email: user.email,
      }));
      showToast("Account created successfully!", "success");
      goBack();
      return true;
    } catch (err: any) {
      console.warn("Sign up error:", err);
      showToast(err.message || "Failed to create account", "error");
      return false;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut();
    } catch (e) {
      console.warn("Sign out error:", e);
    }
    setCurrentUser(null);
    setInquiries([]);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.INQUIRIES);
    showToast("Signed out of Spare Will", "info");
    navigate("signin");
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    try {
      await saveUserProfileToFirestore(updated);
    } catch (e) {
      console.warn("Failed to update profile in Firestore:", e);
    }
    showToast("Profile updated successfully", "success");
  };

  const viewInquiry = (id: string) => {
    setActiveInquiryId(id);
    navigate("inquiry-details", { inquiryId: id });
  };

  const activeInquiry =
    inquiries.find((i) => i.id === activeInquiryId) || inquiries[0] || null;

  const addDraftPart = (
    name: string,
    spec: string = "Standard Fitment",
    subcatMeta?: { subcategoryId?: string; categoryId?: string; categoryName?: string },
  ) => {
    if (!name.trim()) return;
    const existingIndex = draftParts.findIndex(
      (p) => p.name.toLowerCase() === name.trim().toLowerCase(),
    );
    if (existingIndex > -1) {
      setDraftParts((prev) => {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      });
      showToast(`Incremented quantity for ${name}`, "info");
    } else {
      const newPart: PartItem = {
        id: "part_" + Date.now() + Math.random().toString(36).substring(2, 5),
        name: name.trim(),
        spec,
        quantity: 1,
        subcategoryId: subcatMeta?.subcategoryId,
        categoryId: subcatMeta?.categoryId,
        categoryName: subcatMeta?.categoryName,
      };
      setDraftParts((prev) => [...prev, newPart]);
      showToast(`Added ${name} to requested parts`, "success");
    }
  };

  const removeDraftPart = (id: string) => {
    const part = draftParts.find((p) => p.id === id);
    setDraftParts((prev) => prev.filter((p) => p.id !== id));
    if (part) {
      showToast(`Removed ${part.name}`, "info");
    }
  };

  const updateDraftPartQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeDraftPart(id);
      return;
    }
    setDraftParts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity } : p)),
    );
  };

  const updateDraftVehicle = (vehicle: VehicleInfo) => {
    setDraftVehicle(vehicle);
    showToast(`Vehicle set to ${vehicle.make} ${vehicle.model}`, "info");
  };

  const updateDraftContact = (contact: Partial<ContactInfo>) => {
    setDraftContact((prev) => ({ ...prev, ...contact }));
  };

  const resetDraft = () => {
    setDraftParts([]);
    setDraftNotes("");
  };

  const submitInquiry = async (): Promise<string | null> => {
    if (!currentUser) {
      showToast("Please sign in to submit your inquiry", "error");
      setScreenHistory((prev) => [...prev, "signin"]);
      setCurrentScreen("signin");
      return null;
    }

    // Auto-generate unique Firestore document ID
    const newDocRef = doc(collection(db, "inquiries"));
    const newId = newDocRef.id;
    const today = new Date();
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const formattedDate = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;

    const newInquiry: Inquiry = {
      id: newId,
      userId: currentUser.id,
      status: "New",
      vehicle: { ...draftVehicle },
      parts: [...draftParts],
      contact: { ...draftContact },
      additionalNotes: draftNotes,
      createdAt: today.toISOString(),
      statusHistory: [
        {
          status: "New",
          label: "New",
          description: "We have received your inquiry.",
          date: `${formattedDate}, ${today.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
          completed: true,
          active: true,
        },
        {
          status: "Reviewing",
          label: "Reviewing",
          description: "Our team is finding the best parts.",
          completed: false,
          active: false,
        },
        {
          status: "Price Sent",
          label: "Price Sent",
          description: "Check your messages for details.",
          completed: false,
          active: false,
        },
        {
          status: "Customer Contacted",
          label: "Customer Contacted",
          description: "Finalizing the request.",
          completed: false,
          active: false,
        },
      ],
    };

    try {
      // Sanitize to remove any `undefined` values which crash Firestore
      const sanitizedInquiry = JSON.parse(JSON.stringify(newInquiry));

      // Persist to Firestore first
      await saveInquiryToFirestore(sanitizedInquiry);

      setInquiries((prev) => [newInquiry, ...prev]);
      setActiveInquiryId(newId);
      showToast("Inquiry submitted successfully!", "success");
      return newId;
    } catch (err: any) {
      console.warn("Could not persist inquiry to Firestore:", err);
      showToast(
        err.message || "Failed to save inquiry. Please try again.",
        "error",
      );
      return null;
    }
  };

  const openActionModal = (
    type: "call" | "whatsapp",
    serviceTitle: string,
    phoneNumber?: string,
  ) => {
    // Use the number passed in, fall back to the live admin-set number, then a placeholder
    const resolvedNumber =
      phoneNumber ||
      (type === "whatsapp"
        ? businessSettings?.whatsappNumber
        : businessSettings?.callingNumber) ||
      "";
    setActionModal({ type, serviceTitle, phoneNumber: resolvedNumber });
  };

  const closeActionModal = () => {
    setActionModal(null);
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        screenHistory,
        navigate,
        goBack,
        currentUser,
        signIn,
        signInWithGoogle,
        signUp,
        signOut,
        updateProfile,
        businessSettings,
        inventory,
        inquiries,
        activeInquiryId,
        activeInquiry,
        viewInquiry,
        draftVehicle,
        draftParts,
        draftContact,
        draftNotes,
        partSearchQuery,
        setPartSearchQuery,
        addDraftPart,
        removeDraftPart,
        updateDraftPartQuantity,
        updateDraftVehicle,
        updateDraftContact,
        setDraftNotes,
        submitInquiry,
        resetDraft,
        toast,
        showToast,
        actionModal,
        openActionModal,
        closeActionModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
