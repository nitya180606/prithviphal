import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBarxq7rGKJZ75k754l1UU305oBA-hlsKM",
  authDomain: "crop-yield-portal.firebaseapp.com",
  projectId: "crop-yield-portal",
  storageBucket: "crop-yield-portal.firebasestorage.app",
  messagingSenderId: "134865764502",
  appId: "1:134865764502:web:082f646a8293936c1402b7"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);