import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBSicCEggxKE49vqEVUPW6ptisbm8vzNXQ",
    authDomain: "bombo-65888.firebaseapp.com",
    projectId: "bombo-65888",
    storageBucket: "bombo-65888.appspot.com",
    messagingSenderId: "1005927354845",
    appId: "1:1005927354845:web:69aa3d3f991e416c6a2634",
    measurementId: "G-4DT6NT69YZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const submit = document.getElementById('logBtn');
submit.addEventListener("click", function (event) {
    event.preventDefault();

    // Retrieve input values
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Function to validate email using regex
    function isEmailValid(email) {
        const regex = /^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/;
        return regex.test(email);
    }

    // Error handling
    if (!email || !password) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please fill in all the required input fields.'
        });
        return;
    }

    if (!isEmailValid(email)) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid Email',
            text: 'Please enter a valid email address.'
        });
        return;
    }
// Perform login
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            if (user.emailVerified) {
                console.log("User signed in:", user);
                Swal.fire({
                    icon: 'success',
                    title: 'Login Successful',
                    text: 'You have successfully logged in.',
                    confirmButtonText: 'OK'
                }).then(() => {
                    // Clear input fields
                    document.getElementById('email').value = '';
                    document.getElementById('password').value = '';
                    // Redirect to home page
                    window.location.href = "Training.html";
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Email Not Verified',
                    text: 'Please verify your email to log in.'
                });
            }
        })
        .catch((error) => {
            console.error("Login failed:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Wrong credentials.'
            });
        });
});