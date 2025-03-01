async function getRecipeDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const recipeId = urlParams.get("id");

  console.log("Recipe ID from URL:", recipeId);

  if (!recipeId || isNaN(recipeId)) {
    document.getElementById("recipe-details").innerHTML =
      "<h3>Comment here</h3>";
    return;
  }

  try {
    const response = await fetch(`https://dummyjson.com/recipes/${recipeId}`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const recipe = await response.json();
    console.log("Fetched Recipe Data:", recipe);

    // Populate HTML with API Data
    document.getElementById("recipe-name").textContent =
      recipe.name || "Unknown Recipe";
    document.getElementById("recipe-image").src =
      recipe.image || "https://via.placeholder.com/800";
    document.getElementById("chef-name").textContent =
      recipe.chef || "Unknown Chef";
    document.getElementById("upload-time").textContent =
      recipe.uploadTime || "Recently Uploaded";
    document.getElementById("comments").textContent = `Comments: ${
      recipe.reviewCount || "No comments yet"
    }`;
    document.getElementById("rating").textContent = `Rating: ${
      recipe.rating || "★★★★☆"
    }`;
    document.getElementById("servings").textContent = recipe.servings || "N/A";
    document.getElementById("time").textContent =
      recipe.prepTimeMinutes || "N/A";
    document.getElementById("prep-time").textContent = recipe.prepTimeMinutes
      ? `${recipe.prepTimeMinutes} min`
      : "N/A";
    document.getElementById("calories").textContent = recipe.caloriesPerServing
      ? `${recipe.caloriesPerServing} kcal`
      : "Calories not available";
    // Populate Ingredients List
    const ingredientsList = document.getElementById("ingredients");
    ingredientsList.innerHTML = "";
    if (Array.isArray(recipe.ingredients)) {
      recipe.ingredients.forEach((ingredient) => {
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
    if (Array.isArray(recipe.instructions)) {
      recipe.instructions.forEach((step) => {
        let li = document.createElement("li");
        li.textContent = step;
        instructionsList.appendChild(li);
      });
    } else {
      instructionsList.innerHTML = "<li>No steps provided</li>";
    }
  } catch (error) {
    console.error("Error fetching recipe details:", error);
    document.getElementById("recipe-details").innerHTML =
      "<p>Error loading recipe details. Please try again later.</p>";
  }
}

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
    div.innerHTML = `
      <p>${comment.text}</p>
      <small>${comment.time}</small>
      <div class="comment-actions">
        <button onclick="editComment(${comment.id})">Edit</button>
        <button onclick="deleteComment(${comment.id})">Delete</button>
      </div>
    `;
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

function showAllComments() {
  document
    .querySelectorAll(".comment")
    .forEach((comment) => (comment.style.display = "block"));
  document.getElementById("view-more").style.display = "none";
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

displayComments();

// Call function to load the recipe
getRecipeDetail();
