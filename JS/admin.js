import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc, collection, onSnapshot, deleteDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
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
        } else {
            console.log("No such document!");
        }
    }
});


// Ensure user is authenticated
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // Display loading message
        showLoadingMessage("Fetching users data...");

        // Fetch user accounts from Firestore
        const usersRef = collection(db, "users");
        onSnapshot(usersRef, (snapshot) => {
            const userTableBody = document.getElementById("userTableBody");
            userTableBody.innerHTML = ""; // Clear existing table rows
            snapshot.forEach((doc) => {
                const userData = doc.data();
                // Format the date created to a readable format or display "No Data" if it doesn't exist
                const dateCreated = userData.createdAt ? new Date(userData.createdAt.seconds * 1000).toLocaleDateString() : "No Data";
                const row = `
                    <tr>
                        <td>${userData.username}</td>
                        <td>${userData.email}</td>
                        <td>${dateCreated}</td>
                        <td>
                            <button class="btn btn-danger btn-sm delete-button" data-user-id="${doc.id}">Delete</button>
                        </td>
                    </tr>
                `;
                userTableBody.innerHTML += row;
            });
            // Add event listener for delete buttons after updating the table
            addDeleteButtonListener();

            // Close loading message
            Swal.close();
        }, (error) => {
            // Display error message if there's an issue fetching user data
            showError("Failed to fetch user data. Please try again later.");
            console.error("Error fetching user data:", error);
        });
    } else {
        // Display error message if user is not logged in
        showError("You are not logged in. Redirecting to login page...");
        console.log("No user is signed in.");
        // Redirect to login page after 2 seconds
        setTimeout(() => {
            window.location.href = "Login.html";
        }, 2000);
    }
});

document.getElementById("logoutBtn").addEventListener("click", function() {
    window.location.href = "Login.html";
});


// Function to display loading message using SweetAlert2
function showLoadingMessage(message) {
    Swal.fire({
        title: message,
        allowEscapeKey: false,
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
}

// Function to display error message using SweetAlert2
function showError(errorMessage) {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errorMessage,
        timer: 2000,
        timerProgressBar: true,
        toast: true,
        showConfirmButton: false,
    });
}

// Function to delete user account
function deleteUser(userId) {
    const userRef = doc(db, "users", userId);
    deleteDoc(userRef)
        .then(() => {
            // Show success message with SweetAlert2
            Swal.fire(
                'Deleted!',
                'User has been deleted.',
                'success'
            );
            // No need to reload the page as the data will be updated automatically
        })
        .catch((error) => {
            // Show error message with SweetAlert2
            Swal.fire(
                'Error!',
                'Failed to delete user.',
                'error'
            );
            console.error("Error deleting user:", error);
        });
}

// Function to add event listener for delete buttons
function addDeleteButtonListener() {
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const userId = button.dataset.userId;
            const currentUser = auth.currentUser;

            // Check if the user is deleting their own account
            if (currentUser && currentUser.uid === userId) {
                // Display alert informing the user that they will be logged out
                Swal.fire({
                    icon: 'warning',
                    title: 'Warning',
                    text: 'Deleting your own account will log you out. Are you sure?',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Yes, delete it!'
                }).then((result) => {
                    if (result.isConfirmed) {
                        // If confirmed, log out the user and redirect to login page
                        auth.signOut().then(() => {
                            // Show logout message
                            Swal.fire({
                                icon: 'info',
                                title: 'Logging out...',
                                text: 'You will be redirected to the login page.',
                                timer: 2000,
                                timerProgressBar: true,
                                showConfirmButton: false,
                                didOpen: () => {
                                    setTimeout(() => {
                                        window.location.href = "Login.html";
                                    }, 2000);
                                }
                            });
                        });
                    }
                });
            } else {
                // Display confirmation dialog for deleting other users' accounts
                Swal.fire({
                    title: 'Are you sure?',
                    text: 'You will not be able to recover this user!',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Yes, delete it!'
                }).then((result) => {
                    if (result.isConfirmed) {
                        // If confirmed, delete the user
                        deleteUser(userId);
                    }
                });
            }
        });
    });
}

