import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

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
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", function () {
    const submit = document.getElementById('resetBtn');
    const emailInput = document.getElementById('email');

    // Listen for keypress event on email input
    emailInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            submit.click(); // Trigger click event on submit button
        }
    });

    submit.addEventListener("click", function (event) {
        event.preventDefault();

        // Retrieve input value
        const email = document.getElementById('email').value;

        // Function to validate email using regex
        function isEmailValid(email) {
            const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(email);
        }

        // Error handling
        if (!email) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please enter your email address.'
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

        // Perform password reset
        const auth = getAuth();
        sendPasswordResetEmail(auth, email)
            .then(() => {
                // Password reset email sent successfully
                Swal.fire({
                    icon: 'success',
                    title: 'Password Reset Email Sent',
                    text: 'Please check your email for the password reset link.'
                }).then(() => {
                    // Clear input field
                    document.getElementById('email').value = '';
                    // Redirect to login page
                    window.location.href = "login.php";
                });
            })
            .catch((error) => {
                console.error("Password reset error:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Password Reset Error',
                    text: 'Unable to send a password reset email. Please check the email address.'
                });
            });
    });
});
