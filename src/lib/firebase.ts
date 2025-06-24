import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Be explicit about the bucket to avoid any confusion
const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
export const storage = getStorage(app, 
  storageBucket ? `gs://${storageBucket}` : undefined
);

// Log initialization information for debugging
console.log(`Firebase initialized with project: ${import.meta.env.VITE_FIREBASE_PROJECT_ID}`);
console.log(`Storage bucket: ${storageBucket || 'default'}`);
if (!storageBucket) {
  console.warn('No storage bucket specified in environment variables. Using default bucket.');
}