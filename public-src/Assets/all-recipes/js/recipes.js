
import {
  auth,
  signOut,
  onAuthStateChanged,
  db,
  doc,
  getDoc,
} from "../../../firebase/firebase-config.js";


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
        userPic.src = userData.profileImage || "/public-src/Assets/Homepage/assets/logo&profiles/user.png";
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

document.querySelector(".main_profile .fa-close")?.addEventListener("click", () => {
  document.querySelector(".main_profile").style.right = "-50vw";
});

const userLogOut = async () => {
  try {
    await signOut(auth);
    alert("You have been logged out successfully!");
    window.location.href = "/public-src/index.html";
  } catch (error) {
    console.error("Logout Error:", error.message);
  }
};
document.querySelector(".logout")?.addEventListener("click", userLogOut);




let allRecipes = [];
let filteredRecipes = [];
let currentPage = 1;
const itemsPerPage = 9;

/******** Fetch recipes from API ********/

fetch("https://dummyjson.com/recipes")
  .then((response) => response.json())
  .then((data) => {
    allRecipes = data.recipes;
    console.log(allRecipes);
    filteredRecipes = allRecipes;
    displayRecipesWithPagination();
  });

function displayRecipesWithPagination() {
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const recipesToDisplay = filteredRecipes.slice(start, end);

  displayRecipes(recipesToDisplay);
  updatePaginationButtons();
}

function displayRecipes(data) {
  const recipesContainer = document.querySelector(".recipes_cards_display");
  recipesContainer.innerHTML = "";

  data.forEach((recipe) => {
    const card = document.createElement("div");
    card.className = "recipe_card";
    card.innerHTML = `
       <div class="recipe_content">
                        <h5>${recipe.name}</h5>
                        <div class="rating">
                        ${recipe.rating || "★★★★☆"}
                        </div>
                        <div class="chef" style="margin-top:  7px;">
                          <img src="/public-src/Assets/all-recipes/images/chef-pic12(1).png" alt="Chef">
                        <span>Sofie</span>
                        </div>
                        
                        <button class="recipe_btn"><a href="/public-src/Assets/all-recipes/html/fullview.html"
                                    style="color: white; text-decoration: none;">Comment here <i class="fa-solid fa-arrow-right"></i></a></button>
                    </div>
                    <img src="${recipe.image}" class="recipe_img">`;

    recipesContainer.appendChild(card);
  });
}

function updatePaginationButtons() {
  const paginationContainer = document.getElementById("pagination");
  paginationContainer.innerHTML = "";

  const totalPages = Math.ceil(filteredRecipes.length / itemsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("button");
    button.textContent = i;
    button.className = i === currentPage ? "disabled" : "";
    button.disabled = i === currentPage;
    button.onclick = () => {
      currentPage = i;
      displayRecipesWithPagination();
    };

    paginationContainer.appendChild(button);
  }
}

function searchRecipes() {
  const searchQuery = document.getElementById("search").value.toLowerCase();
  filteredRecipes = allRecipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(searchQuery)
  );
  currentPage = 1;
  displayRecipesWithPagination();
}

function filterRecipesByCuisine() {
  const cuisine = document.getElementById("cuisine").value.toLowerCase();
  filteredRecipes = cuisine
    ? allRecipes.filter(
      (recipe) => recipe.cuisine && recipe.cuisine.toLowerCase() === cuisine
    )
    : allRecipes;
  currentPage = 1;
  displayRecipesWithPagination();
}

function viewRecipe(recipeId) {
  // Redirect to recipe-details.html page and pass the recipe ID via URL
  window.location.href = `fullView.html?id=${recipeId}`;
}
