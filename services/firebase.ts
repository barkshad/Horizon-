
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBKYbD6HkAH0IHmS0rrVKzimRqwyCmPcPY",
  authDomain: "aspiration-7b5cb.firebaseapp.com",
  projectId: "aspiration-7b5cb",
  storageBucket: "aspiration-7b5cb.firebasestorage.app",
  messagingSenderId: "315467490776",
  appId: "1:315467490776:web:347e35f374cec5270c7ead"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
