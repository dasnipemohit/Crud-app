
import { initializeApp } from "firebase/app";
 import {getFirestore} from "firebase/firestore";
 import {getStorage} from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyB8dpHWYBu1fF0XNCldAlhyon8WKp0qZHA",
  authDomain: "crud-img-36ac5.firebaseapp.com",
  projectId: "crud-img-36ac5",
  storageBucket: "crud-img-36ac5.appspot.com",
  messagingSenderId: "466158923600",
  appId: "1:466158923600:web:289d841b1d5ba61c270655"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const storage = getStorage(app);
