import {
  db,
  doc,
  getDoc,
  auth,
  signOut,
  onAuthStateChanged,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "../../../firebase/firebase-config.js";

/******** User data if Login or not  *********/

onAuthStateChanged(auth, async (user) => {
  const loginBtn = document.querySelector(".login_btn");
  const userProfile = document.querySelector(".user_profile");
  const usernameElement = document.querySelector(".username");
  const userPic = document.querySelector(".user_pic");
  const userTag = document.querySelector(".user_tag");

  if (user) {
    console.log("User Logged in");

    if (loginBtn) loginBtn.style.display = "none";
    if (userProfile) userProfile.style.display = "block";

    const userRef = doc(db, "Users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();

      if (usernameElement) {
        usernameElement.textContent = userData.username || "Jane Doe";
        userTag.textContent = userData.category || "Masterrrr Chef";
      }

      if (userPic) {
        userPic.src =
          userData.profileImage || "/public-src/Assets/Homepage/assets/logo&profiles/user.png";
      }
    } else {
      if (usernameElement) {
        usernameElement.textContent = "Jane Doe";
      }
      if (userPic) {
        userPic.src = "/public-src/Assets/Homepage/assets/logo&profiles/user.png";
      }
    }
  } else {
    console.log("No user logged in");

    if (userProfile) userProfile.style.display = "none";
    if (loginBtn) loginBtn.style.display = "block";

    if (usernameElement) {
      usernameElement.textContent = "Guest";
    }
    if (userPic) {
      userPic.src = "/public-src/Assets/Homepage/assets/logo&profiles/user.png";
    }
  }
});

/***** User profile slider *****/

document.querySelector(".user_profile")?.addEventListener("click", () => {
  document.querySelector(".main_profile").style.right = "0";
});

document
  .querySelector(".main_profile .fa-close")
  ?.addEventListener("click", () => {
    document.querySelector(".main_profile").style.right = "-50vw";
  });

const userLogOut = async () => {
  try {
    await signOut(auth);
    alert("You have been logged out successfully!");
    window.location.href = "/index.html";
  } catch (error) {
    console.error("Logout Error:", error.message);
  }
};
document.querySelector(".logout")?.addEventListener("click", userLogOut);

const getRecipeIdFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
};

// Fetch and Display Recipe Details
const fetchRecipeDetails = async () => {
  const recipeId = getRecipeIdFromUrl();
  if (!recipeId) {
    console.error("Recipe ID not found in URL");
    document.getElementById("recipe-name").textContent = "Recipe Not Found";
    return;
  }

  try {
    // Get recipe document from Firestore
    const recipeRef = doc(db, "userrecipie", recipeId);
    const recipeSnap = await getDoc(recipeRef);

    if (recipeSnap.exists()) {
      const recipeData = recipeSnap.data();
      console.log(recipeData);
      document.getElementById("recipe-name").textContent =
        recipeData.recipeTitle || "Unknown Recipe";
      document.getElementById("recipe-image").src =
        recipeData.imageURL || "https://via.placeholder.com/800";
      document.querySelector(".recipe_cat").textContent = recipeData.category;
      document.querySelector(".recipe_desc").textContent =
        recipeData.description;
      document.getElementById("servings").textContent =
        recipeData.servings || "N/A";
      document.getElementById("time").textContent = recipeData.time
        ? `${recipeData.time}`
        : "N/A";
      document.getElementById("calories").textContent = recipeData.calories
        ? `${recipeData.calories}`
        : "Calories not available";

      // Populate Ingredients List
      const ingredientsList = document.getElementById("ingredients");
      ingredientsList.innerHTML = "";
      if (Array.isArray(recipeData.cookingIngredients)) {
        recipeData.cookingIngredients.forEach((ingredient) => {
          let li = document.createElement("li");
          li.textContent = ingredient;
          ingredientsList.appendChild(li);
        });
      } else {
        ingredientsList.innerHTML = "<li>No ingredients listed</li>";
      }

      // Populate Instructions List
      const instructionsList = document.getElementById("instructions");
      instructionsList.innerHTML = "";
      if (Array.isArray(recipeData.cookingSteps)) {
        recipeData.cookingSteps.forEach((step, index) => {
          let li = document.createElement("li");
          li.textContent = `${step}`;
          instructionsList.appendChild(li);
        });
      } else {
        instructionsList.innerHTML = "<li>No steps provided</li>";
      }
    } else {
      document.getElementById("recipe-name").textContent = "Recipe Not Found";
    }
  } catch (error) {
    console.error("Error fetching recipe details:", error);
    document.getElementById("recipe-details").innerHTML =
      "<p>Error loading recipe details. Please try again later.</p>";
  }
};

document.querySelector(".postComment").addEventListener("click", addComment);

function addComment() {
  let commentInput = document.getElementById("comment-input");
  let commentText = commentInput.value.trim();

  if (!commentText) return;

  let comments = JSON.parse(localStorage.getItem("comments")) || [];
  let newComment = {
    id: Date.now(),
    text: commentText,
    time: new Date().toLocaleString(),
  };

  comments.push(newComment);
  localStorage.setItem("comments", JSON.stringify(comments));
  commentInput.value = "";
  displayComments();
}

function displayComments() {
  let comments = JSON.parse(localStorage.getItem("comments")) || [];
  let commentList = document.getElementById("comment-list");
  commentList.innerHTML = "";

  comments.forEach((comment, index) => {
    let div = document.createElement("div");
    div.classList.add("comment");

    let p = document.createElement("p");
    p.textContent = comment.text;

    let small = document.createElement("small");
    small.textContent = comment.time;

    let actionsDiv = document.createElement("div");
    actionsDiv.classList.add("comment-actions");

    let editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("editComment");
    editButton.addEventListener("click", () => editComment(comment.id));

    let deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("deleteComment");
    deleteButton.addEventListener("click", () => deleteComment(comment.id));

    actionsDiv.appendChild(editButton);
    actionsDiv.appendChild(deleteButton);
    div.appendChild(p);
    div.appendChild(small);
    div.appendChild(actionsDiv);

    if (index < 5) {
      div.style.display = "block";
    } else {
      div.style.display = "none";
    }

    commentList.appendChild(div);
  });

  let viewMoreBtn = document.getElementById("view-more");
  if (comments.length > 5) {
    viewMoreBtn.style.display = "block";
  } else {
    viewMoreBtn.style.display = "none";
  }
}

function editComment(id) {
  let comments = JSON.parse(localStorage.getItem("comments")) || [];
  let commentToEdit = comments.find((comment) => comment.id === id);

  if (commentToEdit) {
    let newText = prompt("Edit your comment:", commentToEdit.text);
    if (newText !== null) {
      commentToEdit.text = newText.trim();
      localStorage.setItem("comments", JSON.stringify(comments));
      displayComments();
    }
  }
}

function deleteComment(id) {
  let comments = JSON.parse(localStorage.getItem("comments")) || [];
  comments = comments.filter((comment) => comment.id !== id);
  localStorage.setItem("comments", JSON.stringify(comments));
  displayComments();
}

// Show all comments when clicking 'View More'
function showAllComments() {
  document.querySelectorAll(".comment").forEach((comment) => {
    comment.style.display = "block";
  });
  document.getElementById("view-more").style.display = "none";
}

document.getElementById("view-more").addEventListener("click", showAllComments);
// Load comments on page load
displayComments();

document.addEventListener("DOMContentLoaded", fetchRecipeDetails);

// Wait for authentication state
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User logged in:", user.uid);
    setupFavoriteButton(user.uid);
  } else {
    console.log("No user logged in");
  }
});

// Function to handle the favorite button
const setupFavoriteButton = async (userId) => {
  const recipeId = getRecipeIdFromUrl();
  if (!recipeId) return;

  const favoriteBtn = document.getElementById("favorite-btn");

  const userRef = doc(db, "Users", userId);
  const userSnap = await getDoc(userRef);

  let isFavorite = false;

  if (userSnap.exists()) {
    const userData = userSnap.data();
    isFavorite = userData.favorites?.includes(recipeId);
  }

  updateFavoriteButtonUI(favoriteBtn, isFavorite);

  // Toggle favorite on click
  favoriteBtn.addEventListener("click", async () => {
    try {
      if (isFavorite) {
        await updateDoc(userRef, {
          favorites: arrayRemove(recipeId),
        });
        isFavorite = false;
      } else {
        await updateDoc(userRef, {
          favorites: arrayUnion(recipeId),
        });
        isFavorite = true;
      }

      updateFavoriteButtonUI(favoriteBtn, isFavorite);
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  });
};

// Update the button UI based on favorite status
const updateFavoriteButtonUI = (button, isFavorite) => {
  if (isFavorite) {
    alert("Add to your favorites");
    
  } else {
    console.log("Remove from favorites");
  }
};
