document.addEventListener("DOMContentLoaded", function() {
    const lightModeRadio = document.getElementById("light-mode");
    const darkModeRadio = document.getElementById("dark-mode");
    const profilePage = document.querySelector('.container'); // Get the profile page container

    // Function to enable dark mode
    function enableDarkMode() {
        profilePage.classList.add("darkmode"); // Apply dark mode class to the profile page container
        document.body.classList.add("darkmode");
        localStorage.setItem('theme', 'dark'); // Store the theme mode in localStorage
    }

    // Function to disable dark mode
    function disableDarkMode() {
        profilePage.classList.remove("darkmode"); // Remove dark mode class from the profile page container
        document.body.classList.remove("darkmode");
        localStorage.setItem('theme', 'light'); // Store the theme mode in localStorage
    }

    // Function to toggle dark mode
    function toggleDarkMode() {
        if (darkModeRadio && darkModeRadio.checked) {
            enableDarkMode();
        } else {
            disableDarkMode();
        }
    }

    // Check if the radio buttons exist
    if (lightModeRadio && darkModeRadio) {
        // Check the initial state
        const savedTheme = localStorage.getItem('theme'); // Get the saved theme mode from localStorage
        if (savedTheme === 'dark') {
            darkModeRadio.checked = true; // Set the radio button accordingly
            enableDarkMode(); // Apply dark mode if the saved theme is dark
        } else {
            lightModeRadio.checked = true; // Set the radio button accordingly
            disableDarkMode(); // Apply light mode if the saved theme is light
        }

        // Add event listeners to the radio buttons
        lightModeRadio.addEventListener("change", toggleDarkMode);
        darkModeRadio.addEventListener("change", toggleDarkMode);
    }

    // Check the initial state
    const savedTheme = localStorage.getItem('theme'); // Get the saved theme mode from localStorage
    if (savedTheme === 'dark') {
        enableDarkMode(); // Apply dark mode if the saved theme is dark
    } else {
        disableDarkMode(); // Apply light mode if the saved theme is light
    }
});
