import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 1. New Credentials (from your "hotel-management-2cdb9" project)
const firebaseConfig = {
  apiKey: "AIzaSyA3LU39I4MEo2UWl5I2mpRQXYv3mWWNXs4",
  authDomain: "hotel-management-2cdb9.firebaseapp.com",
  databaseURL: "https://hotel-management-2cdb9-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "hotel-management-2cdb9",
  storageBucket: "hotel-management-2cdb9.firebasestorage.app",
  messagingSenderId: "558302722945",
  appId: "1:558302722945:web:5cab077a93a3719f528680",
  measurementId: "G-Q5HR51J8VZ"
};

// 2. Singleton Pattern: Ensures we don't initialize Firebase twice (prevents crashes in Next.js)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// 3. Export 'auth' and 'db' so your app can use them
export const auth = getAuth(app);
export const db = getFirestore(app);