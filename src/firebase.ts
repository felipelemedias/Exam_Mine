import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration values
const firebaseConfig = {
  apiKey: "AIzaSyCuImTbwE_CP7sJBnCt6QUw8-TME3WH_RY",
  authDomain: "exam-mine.firebaseapp.com",
  projectId: "exam-mine",
  storageBucket: "exam-mine.firebasestorage.app",
  messagingSenderId: "280498410761",
  appId: "1:280498410761:web:2c626229245b5c4fd06fd8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

export default app;