import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, doc, query, where, getDocs, setDoc, collection, onSnapshot, deleteDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

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
const auth = getAuth(app);
const db = getFirestore(app);

// Add event listener to the registration button
regBtn.addEventListener("click", async function (event) {
    event.preventDefault(); // Prevent default form submission behavior

    // Get user input values
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    // Check for empty fields
    if (!username || !email || !password || !confirmPassword) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'All fields are required.',
        });
        return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'The password and confirm password fields must match.',
        });
        return;
    }

    // Check if the email is valid
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Please enter a valid email address.',
        });
        return;
    }

    // Check if the password is between 8 and 15 characters long
    if (password.length < 8 || password.length > 15) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'The password must be between 8 and 15 characters long.',
        });
        return;
    }

    // Check if the username already exists in Firestore
    const usersRef = collection(db, "users");
    const querySnapshot = await getDocs(query(usersRef, where("username", "==", username)));
    if (!querySnapshot.empty) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'The username is already taken. Please choose another one.',
        });
        return;
    }

    // Create user with email and password
    createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            // Send email verification
            await sendEmailVerification(auth.currentUser)
                .then(() => {
                    console.log("Verification email sent");
                    // Display a success notification
                    Swal.fire({
                        icon: 'success',
                        title: 'Verification Email Sent',
                        text: 'A verification email has been sent to your email address.',
                    }).then(() => {
                        // Redirect to login page
                        window.location.href = "index.html";
                    });
                })
                .catch((error) => {
                    console.error("Error sending verification email:", error);
                    // Display an error notification
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Error sending verification email. Please try again later.',
                    });
                });

           // Add user information to Firestore
           const user = userCredential.user;
           const userRef = doc(db, "users", user.uid);
           setDoc(userRef, {
               email: user.email,
               username: username,
               gender: document.getElementById("gender").value,
               currentWeight: document.getElementById("cweight").value,
               targetWeight: document.getElementById("tweight").value,
               height: document.getElementById("height").value,
           })
               .then(() => {
                   console.log("User data added to Firestore");

                   // Update profile information on the profile page
                       document.getElementById("usernamePlaceholder").textContent = username;
                       document.getElementById("currentWeight").value = document.getElementById("cweight").value;
                       document.getElementById("targetWeight").value = document.getElementById("tweight").value;
                       document.getElementById("height").value = document.getElementById("height").value;
                       


                   // Navigate to home page or do further actions
                   console.log("Navigate to home page");
               })
               .catch((error) => {
                   console.error("Error adding user data to Firestore:", error);
                   // Display an error notification
                   Swal.fire({
                       icon: 'error',
                       title: 'Error',
                       text: 'An error occurred while registering. Please try again later.',
                   });
               });
       })
       .catch((error) => {
           const errorCode = error.code;
           const errorMessage = error.message;

           if (errorCode === "auth/email-already-in-use") {
               // Display an error notification
               Swal.fire({
                   icon: 'error',
                   title: 'Error',
                   text: 'The email address is already in use.',
               });
           } else if (errorCode === "auth/weak-password") {
               // Display an error notification
               Swal.fire({
                   icon: 'error',
                   title: 'Error',
                   text: 'The password is too weak.',
               });
           } else {
               // Display an error notification with the specific error message
               Swal.fire({
                   icon: 'error',
                   title: 'Error',
                   text: errorMessage,
               });
           }

           console.error(errorMessage);
       });
});
