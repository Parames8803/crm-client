// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: "tasmanager-33ff4.firebaseapp.com",
  projectId: "tasmanager-33ff4",
  storageBucket: "tasmanager-33ff4.appspot.com",
  messagingSenderId: "29543140424",
  appId: "1:29543140424:web:eb509c17c45031350d1c7d"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);