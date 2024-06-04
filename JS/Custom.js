import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
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

        // Fetch and display custom workouts from Firestore
        try {
            const workoutsQuery = collection(db, "users", user.uid, "workouts");
            const workoutSnapshot = await getDocs(workoutsQuery);
            workoutSnapshot.forEach((doc) => {
                const workoutData = doc.data();
                displayWorkout(workoutData);
            });
        } catch (error) {
            console.error("Error fetching custom workouts: ", error);
        }
    } else {
        console.log("No user is signed in.");
        // Redirect to login page if no user is signed in
        window.location.href = "Login.html";
    }
});

document.getElementById("logoutBtn").addEventListener("click", function() {
    window.location.href = "Login.html";
});

// Get modal element
var modal = document.getElementById("exerciseModal");

// Get buttons that open the modal
var openModalBtns = [document.getElementById("openModalBtn"), document.getElementById("addWorkoutBtn")];

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// Get elements for sets functionality
var setCount = document.getElementById("setCount");
var increaseSets = document.getElementById("increaseSets");
var decreaseSets = document.getElementById("decreaseSets");

var repCount = document.getElementById("repCount");
var increaseReps = document.getElementById("increaseReps");
var decreaseReps = document.getElementById("decreaseReps");

// Add event listeners to buttons that open the modal
openModalBtns.forEach(btn => {
    btn.onclick = function() {
        modal.style.display = "block";
    }
});

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Initialize reps count
let sets = 0;
let reps = 0;

// Increase set
increaseSets.addEventListener("click", function() {
    sets++;
    setCount.textContent = sets;
});

// Decrease reps
decreaseSets.addEventListener("click", function() {
    if (sets > 0) {
        sets--;
        setCount.textContent = sets;
    }
});

// Increase reps
increaseReps.addEventListener("click", function() {
    reps++;
    repCount.textContent = reps;
});

// Decrease reps
decreaseReps.addEventListener("click", function() {
    if (reps > 0) {
        reps--;
        repCount.textContent = reps;
    }
});

// Handle form submission
document.getElementById("saveWorkout").addEventListener("click", async function() {
    // Get the selected exercise
    var exercise = document.getElementById("exerciseDropdown").value;

    // Get the reps count
    var sets = document.getElementById("setCount").textContent;

    var reps = document.getElementById("repCount").textContent;

    // Get the initial message and workout list divs
    var initialMessage = document.getElementById("initialMessage");
    var workoutList = document.getElementById("workoutList");

    // Create a new div to display the custom workout
    var workoutDiv = document.createElement("div");
    workoutDiv.classList.add("workout-details");

    // Set the video source link based on the selected exercise
    var videoSrc = '';
    switch(exercise) {
        case 'Farmer’s-Carry':
            videoSrc = 'https://www.youtube.com/watch?v=z7E_YU9P1jU';
            break;
        case 'Deadlift':
            videoSrc = 'https://www.youtube.com/shorts/ZaTM37cfiDs';
            break;
        case 'Bench-Press':
            videoSrc = 'https://www.youtube.com/shorts/hWbUlkb5Ms4';
            break;
        case 'Incline-Bench-Press':
            videoSrc = 'https://www.youtube.com/shorts/MRmeUet5VUw';
            break;
        case 'Standing-Chest-Fly':
            videoSrc = 'https://www.youtube.com/shorts/tGXIQR89-JE';
            break;
        case 'Bent-over-Rowy':
            videoSrc = 'https://www.youtube.com/shorts/IOOLhrkN_NI';
            break;
        case 'Lat-Pulldown':
            videoSrc = 'https://www.youtube.com/shorts/77bPLrsMwiQ';
            break;
        case 'Bicep-Curl':
            videoSrc = 'https://www.youtube.com/shorts/1wgSAr2hPHk';
            break;
        case 'Triceps-Pushdown':
            videoSrc = 'https://www.youtube.com/shorts/WjLJ7zIppXQ';
            break;
        case 'Reverse-Curl':
            videoSrc = 'https://www.youtube.com/shorts/sNxcFNo_6ug';
            break;
        case 'Overhead-Press':
            videoSrc = 'https://www.youtube.com/shorts/DN3WXJlB1Q4';
            break;
        case 'Lateral-Raise':
            videoSrc = 'https://www.youtube.com/shorts/JIhbYYA1Q90';
            break;
        case 'Bent-over-Reverse-Fly':
            videoSrc = 'https://www.youtube.com/watch?v=iO6Q_HEwOtA';
            break;
        case 'Squat':
            videoSrc = 'https://www.youtube.com/shorts/gslEzVggur8';
            break;
        case 'Glute-Ham-Raise':
            videoSrc = 'https://www.youtube.com/shorts/nhTxryN_Loc';
            break;
        case 'Bulgarian-Split-Squat':
            videoSrc = 'https://www.youtube.com/shorts/uODWo4YqbT8';
            break;
    }
    // Set the inner HTML of the workout div including YouTube video and workout details
    workoutDiv.innerHTML = `
    <div class="video-container">
        <iframe width="100%" height="100%" src="${videoSrc}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
    </div>
    <div class="workout-info">
        <h2>Your Custom Workout</h2>
        <p>Exercise: ${exercise.charAt(0).toUpperCase() + exercise.slice(1)}</p>
        <p>Sets: ${sets}</p>
        <p>Reps: ${reps}</p>
        <button class="update-workout">Update</button>
        <button class="delete-workout">Delete</button>
        <button class="view-video">View Video</button>
    </div>
`;

    // Append the new workout div to the workout list div
    workoutList.appendChild(workoutDiv);

    // Show the workout list and "Add custom workout" button if not already visible
    if (workoutList.style.display === "none") {
        workoutList.style.display = "block";
        document.getElementById("addWorkoutBtn").style.display = "block";
    }

    // Hide the initial message
    initialMessage.classList.add("hidden");

    // Close the modal
    modal.style.display = "none";

    // Add the custom workout to Firestore
    try {
        await addDoc(collection(db, "users", auth.currentUser.uid, "workouts"), {
            exercise: exercise,
            sets: sets,
            reps: reps
        });
    } catch (error) {
        console.error("Error adding custom workout: ", error);
    }

    // Add event listeners to update and delete buttons
    workoutDiv.querySelector(".delete-workout").addEventListener("click", function() {
        workoutList.removeChild(workoutDiv);

        // If no more workouts, show the initial message again
        if (workoutList.children.length === 0) {
            workoutList.style.display = "none";
            initialMessage.classList.remove("hidden");
            document.getElementById("addWorkoutBtn").style.display = "none";
        }
    });

    workoutDiv.querySelector(".update-workout").addEventListener("click", function() {
        document.getElementById("exerciseDropdown").value = exercise;
        document.getElementById("setCount").textContent = sets;
        document.getElementById("repCount").textContent = reps;
        workoutList.removeChild(workoutDiv);
        modal.style.display = "block";
    });
    workoutDiv.querySelector(".view-video").addEventListener("click", function() {
        window.open(videoSrc, '_blank');
    });
});

// Function to display custom workouts fetched from Firestore
function displayWorkout(workoutData) {
    const workoutList = document.getElementById("workoutList");
    const initialMessage = document.getElementById("initialMessage");
    const workoutDiv = document.createElement("div");
    workoutDiv.classList.add("workout-details");

    // Set the video source link based on the selected exercise
    var videoSrc = '';
    switch (workoutData.exercise) {
        // Set videoSrc for each exercise
    }

    // Set the inner HTML of the workout div including YouTube video and workout details
    workoutDiv.innerHTML = `
    <div class="video-container">
        <iframe width="100%" height="100%" src="${videoSrc}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
    </div>
    <div class="workout-info">
        <h2>Your Custom Workout</h2>
        <p>Exercise: ${workoutData.exercise.charAt(0).toUpperCase() + workoutData.exercise.slice(1)}</p>
        <p>Sets: ${workoutData.sets}</p>
        <p>Reps: ${workoutData.reps}</p>
        <button class="update-workout">Update</button>
        <button class="delete-workout">Delete</button>
        <button class="view-video">View Video</button>
    </div>
`;

    // Append the new workout div to the workout list div
    workoutList.appendChild(workoutDiv);

    // Show the workout list and "Add custom workout" button if not already visible
    if (workoutList.style.display === "none") {
        workoutList.style.display = "block";
        document.getElementById("addWorkoutBtn").style.display = "block";
    }

    // Hide the initial message
    initialMessage.classList.add("hidden");

    // Add event listeners to update and delete buttons
    workoutDiv.querySelector(".delete-workout").addEventListener("click", function() {
        workoutList.removeChild(workoutDiv);

        // If no more workouts, show the initial message again
        if (workoutList.children.length === 0) {
            workoutList.style.display = "none";
            initialMessage.classList.remove("hidden");
            document.getElementById("addWorkoutBtn").style.display = "none";
        }
    });

    workoutDiv.querySelector(".update-workout").addEventListener("click", function() {
        // Set dropdown and counts values to the workoutData values
        document.getElementById("exerciseDropdown").value = workoutData.exercise;
        document.getElementById("setCount").textContent = workoutData.sets;
        document.getElementById("repCount").textContent = workoutData.reps;
        workoutList.removeChild(workoutDiv);
        modal.style.display = "block";
    });
    workoutDiv.querySelector(".view-video").addEventListener("click", function() {
        window.open(videoSrc, '_blank');
    });
}
