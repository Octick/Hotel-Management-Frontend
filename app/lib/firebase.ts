import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAFk43CPz6wWp3dOrb5PJ4WLPbspAutNzk",
  authDomain: "hotelmanagement-eaa37.firebaseapp.com",
  projectId: "hotelmanagement-eaa37",
  storageBucket: "hotelmanagement-eaa37.firebasestorage.app",
  messagingSenderId: "345100816590",
  appId: "1:345100816590:web:056961086a996e7625009f",
  measurementId: "G-MB07213BWH"
};

// 1. Singleton Pattern: Ensures we don't initialize Firebase twice
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// 2. Export 'auth' so your Login/Register forms can use it
export const auth = getAuth(app);