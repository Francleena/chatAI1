import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyClpRfdgUQv9vzlYnN4uyRubxJDYdiuYHg",
    authDomain: "chatai1-514cf.firebaseapp.com",
    projectId: "chatai1-514cf",
    storageBucket: "chatai1-514cf.firebasestorage.app",
    messagingSenderId: "705849621239",
    appId: "1:705849621239:web:8bf1d1adb5311022d971f2",
    measurementId: "G-7EWH9F4CJD"
};

export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
