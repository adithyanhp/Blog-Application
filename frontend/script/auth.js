// The base URL for your Django backend
// const API_URL = 'http://127.0.0.1:8000/api';

// Authentication functions for login, logout, and token management
// Login function that sends a POST request to the Django backend to obtain JWT tokens 👇

async function loginUser(username, password) {
    try {
        const response = await fetch(`${API_URL}/token/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                username: username, 
                password: password 
            })
        });

        if (response.ok) {
            const data = await response.json();
            
            // The magic step: Saving the secret keys to the browser
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            
            alert("Login successful!");
            // You can redirect the user here, e.g., window.location.href = '/home.html';
            return true;
        } else {
            alert("Invalid username or password.");
            return false;
        }
    } catch (error) {
        console.error("Error during login:", error);
    }
}


// Whenever a user tries to "Like" a post or "Submit a Comment" later on, we need a quick way to grab that saved token to prove who they are.
// Call this function anytime you need to attach the token to a request
function getAccessToken() {
    return localStorage.getItem('access_token');
}

// Call this when the user clicks "Logout"
function logoutUser() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    alert("You have been logged out.");
}

