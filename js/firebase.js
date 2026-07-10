import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Replace these values with your actual web configuration settings from the Firebase console
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBp0TSoBlDIqD66wWTCwuZCcrxLVfrftdo",
  authDomain: "kwench-rankings.firebaseapp.com",
  projectId: "kwench-rankings",
  storageBucket: "kwench-rankings.firebasestorage.app",
  messagingSenderId: "231014930339",
  appId: "1:231014930339:web:55504b8a9ea4fa6d552c16",
  measurementId: "G-JP7GHTW9QB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);