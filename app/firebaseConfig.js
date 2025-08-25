import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Make sure AsyncStorage is imported

const firebaseConfig = {
  apiKey: "AIzaSyCbRiThKnSjAC6wKIRTA2znoFiEFkb_8S0",
  authDomain: "myexpoapp-898fc.firebaseapp.com",
  projectId: "myexpoapp-898fc",
  storageBucket: "myexpoapp-898fc.firebasestorage.app",
  messagingSenderId: "364020595479",
  appId: "1:364020595479:web:d111c03186e097f7cb5552",
  measurementId: "G-FNZ99K0NE9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage), // Use AsyncStorage for persistence
});
const db = getFirestore(app);

export { auth, db }; // Export both auth and db
