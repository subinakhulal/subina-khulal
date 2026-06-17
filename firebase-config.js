 // ==========================================
// FIREBASE CONFIGURATION (COMPAT SDK)
// ==========================================
// Connected to Firebase Project: portfolio-8b430

const firebaseConfig = {
    apiKey: "AIzaSyAKJPySe68MZ7zt-sprBz5zAnri9wU6TYA",
    authDomain: "subinakhulal-50367.firebaseapp.com",
    projectId: "subinakhulal-50367",
    storageBucket: "subinakhulal-50367.firebasestorage.app",
    messagingSenderId: "1061323856309",
    appId: "1:1061323856309:web:ce163a3055fe61bca761fc",
    measurementId: "G-P15E3Y9G2B"
};

// Initialize Firebase (Only if config is set, otherwise fall back to mock data)
let firebaseApp = null;
let auth = null;
let db = null;

// Simple check to make sure the student replaced the placeholders
const isFirebaseConfigured = firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY";

if (isFirebaseConfigured) {
    try {
        firebaseApp = firebase.initializeApp(firebaseConfig);
        auth = firebase.auth();
        db = firebase.firestore();
        console.log("Firebase initialized successfully (Authentication & Firestore).");
    } catch (error) {
        console.error("Firebase initialization failed: ", error);
    }
} else {
    console.warn("Firebase is not configured yet. The portfolio will run in 'Offline Mock Data' mode.");
}

// ==========================================
// STUDENT IDENTIFIER SETTING
// ==========================================
// In a single-student portfolio, keep this consistent between index.html and admin.html.
const STUDENT_ID = "alex_morgan";
