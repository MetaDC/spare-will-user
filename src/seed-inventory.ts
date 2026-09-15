import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import config from '../firebase-applet-config.json'; // Need to resolve JSON without assert since older node versions or npx tsx might complain, or maybe assert is fine. Let's just use regular import.

const firebaseConfig = {
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId,
};

const app = initializeApp(firebaseConfig);
const db = config.firestoreDatabaseId && config.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, config.firestoreDatabaseId)
  : getFirestore(app);

async function seed() {
  console.log('Seeding inventory collection...');
  const inventoryCol = collection(db, 'inventory');

  for (const part of dummyParts) {
    try {
      await addDoc(inventoryCol, {
        ...part,
        createdAt: serverTimestamp()
      });
      console.log(`Added: ${part.name}`);
    } catch (e) {
      console.error(`Failed to add ${part.name}:`, e.message);
    }
  }

  console.log('Seeding complete!');
  process.exit(0);
}

seed().catch(console.error);
