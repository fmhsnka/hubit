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
            document.getElementById("usernamePlaceholder").textContent = userData.username;
            document.querySelector(".name").textContent = userData.username;
            document.getElementById("cweight").textContent = userData.currentWeight + ' kg';
            document.getElementById("tweight").textContent = userData.targetWeight + ' kg';
            document.getElementById("height").textContent = userData.height + ' cm';
            document.getElementById("gender").textContent = userData.gender;  // Changed from .value to .textContent

            // Populate modal fields with user data
            document.getElementById("name").value = userData.username;
            document.getElementById("modal-currentWeight").value = userData.currentWeight + ' kg';
            document.getElementById("modal-targetWeight").value = userData.targetWeight + ' kg';
            document.getElementById("modal-height").value = userData.height + ' cm';
            document.getElementById("modal-gender").value = userData.gender;
        } else {
            console.log("No such document!");
        }
    } else {
        console.log("No user is signed in.");
        // Redirect to login page if no user is signed in
        window.location.href = "Login.html";
    }
});

// Get the edit button
const editBtn = document.querySelector('.editBtn');

// Get the modal
const modal = document.getElementById('editModal');

// Get the <span> element that closes the modal
const span = document.querySelector('.close');

// When the user clicks the edit button, open the modal 
editBtn.onclick = function (event) {
    // Prevent default form submission behavior
    event.preventDefault();
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Handle form submission
document.getElementById("editForm").addEventListener("submit", async function (event) {
    event.preventDefault();
    // Get form values
    const name = document.getElementById("name").value;
    const currentWeight = document.getElementById("modal-currentWeight").value.replace(' kg', '');
    const targetWeight = document.getElementById("modal-targetWeight").value.replace(' kg', '');
    const height = document.getElementById("modal-height").value.replace(' cm', '');
    const gender = document.getElementById("modal-gender").value;

    // Get current user
    const user = auth.currentUser;

    if (user) {
        // Update Firestore with new values
        const userRef = doc(db, "users", user.uid);
        try {
            await updateDoc(userRef, {
                username: name,
                currentWeight: currentWeight,
                targetWeight: targetWeight,
                height: height,
                gender: gender
            });
            console.log("User data updated successfully");

            // Update profile information
            document.querySelector('.name').textContent = name;
            document.getElementById("cweight").textContent = currentWeight + ' kg';
            document.getElementById("tweight").textContent = targetWeight + ' kg';
            document.getElementById("height").textContent = height + ' cm';
            document.getElementById("gender").textContent = gender;  // Changed from .value to .textContent

            // Close the modal
            modal.style.display = "none";
        } catch (error) {
            console.error("Error updating document: ", error);
        }
    }
});
