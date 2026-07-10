import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBp0TSoBlDIQd66wWTCwuZCcrxLVfrftdo",
  authDomain: "kwench-rankings.firebaseapp.com",
  projectId: "kwench-rankings",
  storageBucket: "kwench-rankings.firebasestorage.app",
  messagingSenderId: "231014930339",
  appId: "1:231014930339:web:55504b8a9ea4fa6d552c16",
  measurementId: "G-JP7GHTW9QB"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);