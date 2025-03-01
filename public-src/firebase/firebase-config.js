import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  onAuthStateChanged,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
  updateEmail
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  onSnapshot,
  updateDoc,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  where,
  deleteDoc,
  arrayUnion, arrayRemove
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCMeJCTXbdJorjOdi-5woYwoG6rb7ddDDQ",
  authDomain: "kukbuk-project-45362.firebaseapp.com",
  projectId: "kukbuk-project-45362",
  storageBucket: "kukbuk-project-45362.firebasestorage.app",
  messagingSenderId: "695377977253",
  appId: "1:695377977253:web:e4bf823163001937c6924c",
};



const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  onAuthStateChanged,
  db,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  onSnapshot,
  updateDoc,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  where,
  deleteDoc,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updateEmail,
  arrayUnion, arrayRemove
};
