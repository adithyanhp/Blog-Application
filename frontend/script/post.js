// script/post.js

// This script is for the post.html page, which displays a single post in full detail.


const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');

// We updated these IDs to match the new Stitch template!
const titleElement = document.getElementById('post-title');
const authorNameElement = document.getElementById('post-author-name');
const authorHandleElement = document.getElementById('post-author-handle');
const dateElement = document.getElementById('post-date');
const contentElement = document.getElementById('post-content');
const imageElement = document.getElementById('post-image');
const categoryElement = document.getElementById('post-category');
const likesCountElement = document.getElementById('post-likes-count');
const commentsCountElement = document.getElementById('post-comments-count');

async function getSinglePost() {
    if (!postId) {
        titleElement.innerText = "Post not found!";
        contentElement.innerText = "No post ID was provided in the URL.";
        return; 
    }

    try {
        // We added { cache: 'no-cache' } to ensure the browser fetches the latest data from the server, rather than using a potentially stale cached version.👇 
        const response = await fetch(`http://127.0.0.1:8000/api/posts/${postId}/`, { cache: 'no-cache' });
        
        if (!response.ok) {
            throw new Error("Post not found in database");
        }

        const postData = await response.json();

        // Inject the text into the exact right spots in our new design
        titleElement.innerText = postData.title;
        authorNameElement.innerText = postData.author;
        authorHandleElement.innerText = `@${postData.author}`;
        
        const date = new Date(postData.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        dateElement.innerText = date;
        
        // Use the image if it exists, otherwise use a placeholder
        imageElement.src = postData.image ? postData.image : 'https://placehold.co/800x450/e7eeff/111c2d?text=No+Image';
        
        // Show category if it exists
        categoryElement.innerText = postData.category ? postData.category : 'Article';

        // Update likes and comments count
        likesCountElement.innerText = postData.likes_count || 0;
        commentsCountElement.innerText = postData.comments ? postData.comments.length : 0;

        // Inject the content (using innerHTML allows basic formatting like paragraphs if your backend sends it)
        contentElement.innerHTML = `<p>${postData.content}</p>`;

    } catch (error) {
        console.error("Something went wrong:", error);
        titleElement.innerText = "Error loading the post.";
        contentElement.innerText = "We couldn't load this post. Please try again later.";
    }
}

// We use the pageshow event instead of DOMContentLoaded because it fires both on a fresh page load and when the user navigates back to this page using the browser's back button. This ensures that the post data is always up-to-date, especially after actions like liking a post or adding a comment. 👇
// getSinglePost();
window.addEventListener('pageshow', getSinglePost);


// --- NEW: Authentication & Like Post Logic ---

async function togglePostLike() {
    // 1. Grab the VIP pass from browser memory
    const token = localStorage.getItem('access_token');

    // 2. Stop the user if they aren't logged in
    if (!token) {
        alert("You need to log in to like a post!");
        window.location.href = 'login.html';
        return;
    }

    try {
        // 3. Send the request to your Django backend with the token
        const response = await fetch('http://127.0.0.1:8000/api/likes/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ 
                post: postId  // This uses the postId you already extracted at the top of the file!
            })
        });

        if (response.ok) {
            // If successful, reload the post data to update the like count instantly
            getSinglePost(); 
        } else if (response.status === 401) {
            alert("Your session expired. Please log in again.");
            localStorage.removeItem('access_token');
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error("Error toggling like:", error);
    }
}

