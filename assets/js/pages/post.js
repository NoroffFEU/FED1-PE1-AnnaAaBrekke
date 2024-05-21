import { showErrorAlert } from "../utils/alerts.js";
import { getSinglePost } from "../api/getApi.js";
import { hideLoader, showLoader } from "../utils/loading.js";
import { getName } from "../auth/userName.js";

// Get URL parameters and extract post ID
const urlParams = new URLSearchParams(window.location.search);
console.log("The URL:", urlParams);
const postId = urlParams.get("id");
console.log("The link", postId);
const name = getName();

// Check if the script is running on the post page
if (window.location.pathname.includes("post/index.html")) {
  if (!postId) {
    // If no post ID is found in URL parameters, show an error alert
    console.error("No post ID in URL parameters");
    showErrorAlert("No post ID provided. Please check the URL and try again.");
  } else {
    // If post ID is found, fetch and display the post
    console.log("Fetching single post with ID:", postId);
    fetchAndDisplaySinglePost(postId);
  }
}

// Function to fetch and display a single post
export async function fetchAndDisplaySinglePost(postId) {
  try {
    showLoader();
    const response = await getSinglePost(name, postId); // Fetch single post data
    const post = response.data;

    console.log("Post data received:", post);
    displaySinglePost(post); // Display the fetched post
  } catch (error) {
    console.error("Error fetching or displaying single post:", error);
    showErrorAlert("Failed to load post. Please try again later.");
  } finally {
    console.log("Calling hideLoader");
    hideLoader();
  }
}

// Function to display a single post in the DOM
function displaySinglePost(post) {
  const mainPostContent = document.querySelector(".main-post");
  mainPostContent.innerHTML = ""; // Clear previous post content

  const defaultImage = "https://placehold.co/600x400";
  const imgSrc = post.media && post.media.url ? post.media.url : defaultImage;
  const imgAlt =
    post.media && post.media.alt ? post.media.alt : "Default image description";

  // Generate HTML for tags if available
  let tagsHtml = "";
  if (post.tags && Array.isArray(post.tags)) {
    tagsHtml = post.tags
      .map((tag) => {
        const tagLabel = tag.label || tag; // Use 'tag' as the label if 'label' property does not exist
        return `<button class="tag" value="${tagLabel}">${tagLabel}</button>`;
      })
      .join("");
  } else {
    console.log("No tags to display or tags are not in expected format.");
  }

  // Create and append post header to the main content
  const postHeader = document.createElement("div");
  postHeader.classList.add("post-header");
  postHeader.innerHTML = `
    <img class="post-img" src="${imgSrc}" alt="${imgAlt}" />
    <h1 class="post-title">${post.title}</h1>
    <div class="post-author"${post.author}</div>
    <time class="post-date" datetime="${post.created}">${new Date(
    post.updated
  ).toLocaleDateString()}</time>
    <div class="tags">${tagsHtml}</div>
  `;
  mainPostContent.appendChild(postHeader);

  // Create and append post content section
  const contentSection = document.createElement("section");
  contentSection.classList.add("content");
  contentSection.innerHTML = `
    <p class="post-text">${post.body}</p>
  `;
  mainPostContent.appendChild(contentSection);

  // Generate share URL
  const shareUrl = `${window.location.origin}/post/index.html?id=${postId}`;

  // Create and append share section
  const sharePost = document.createElement("div");
  sharePost.classList.add("share");
  sharePost.innerHTML = `
      <h3 class = "share-title">Share this post</h3>
    `;

  const shareInput = document.createElement("input");
  shareInput.classList.add("share-link");
  shareInput.value = shareUrl;
  shareInput.readOnly = true; // Make the input read-only

  const copyButton = document.createElement("button");
  copyButton.classList.add("copy-button");
  copyButton.textContent = "Copy";
  copyButton.addEventListener("click", () => {
    // Copy share URL to clipboard
    shareInput.select();
    document.execCommand("copy");
    // Provide feedback to user when copied
    copyButton.textContent = "Copied!";
    setTimeout(() => {
      copyButton.textContent = "Copy";
    }, 1500);
  });

  sharePost.appendChild(shareInput);
  sharePost.appendChild(copyButton);
  mainPostContent.appendChild(sharePost);
}
