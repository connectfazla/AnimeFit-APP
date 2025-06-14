
// IMPORTANT: Replace with your Firebase project's configuration
// For security, consider using environment variables for these values
// https://firebase.google.com/docs/web/setup#config-object

import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
// import { getFirestore, type Firestore } from "firebase/firestore"; // Example if you add Firestore later

const firebaseConfig = {
  apiKey: "AIzaSyDyiSgC78h5iqVh3DU5i3xZ424MndsaVL4",
  authDomain: "anime-fit.firebaseapp.com",
  projectId: "anime-fit",
  storageBucket: "anime-fit.firebasestorage.app",
  messagingSenderId: "688350075864",
  appId: "1:688350075864:web:33dfd3a79b1ac66cb1b0ad",
  measurementId: "G-DXF0571BVZ"
};

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth: Auth = getAuth(app);
// const db: Firestore = getFirestore(app); // Example if you add Firestore later

export { app, auth /*, db */ };
