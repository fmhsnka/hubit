import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBSicCEggxKE49vqEVUPW6ptisbm8vzNXQ",
    authDomain: "bombo-65888.firebaseapp.com",
    projectId: "bombo-65888",
    storageBucket: "bombo-65888.appspot.com",
    messagingSenderId: "1005927354845",
    appId: "1:1005927354845:web:69aa3d3f991e416c6a2634",
    measurementId: "G-4DT6NT69YZ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            updateUserDataLocally(userData); // Store user data locally
            updateProfile(userData); // Update profile with user data
        } else {
            console.log("No such document!");
        }
    } else {
        console.log("No user is signed in.");
        window.location.href = "Login.html";
    }
});

// Function to store user data in localStorage
function updateUserDataLocally(userData) {
    localStorage.setItem('userData', JSON.stringify(userData));
}

// Function to update profile with user data
function updateProfile(userData) {
    document.getElementById("usernamePlaceholder").textContent = userData.username;
}

// Function to retrieve user data from localStorage
function getUserDataLocally() {
    const userDataString = localStorage.getItem('userData');
    return JSON.parse(userDataString);
}