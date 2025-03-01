
import {
  auth,
  signOut,
  onAuthStateChanged,
  db,
  doc,
  getDoc,
  collection,
  getDocs,
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
    window.location.href = "/index.html";
  } catch (error) {
    console.error("Logout Error:", error.message);
  }
};
document.querySelector(".logout")?.addEventListener("click", userLogOut);


/********************************/
/***** Fetching recipes data *****/
/********************************/

const fetchRecipes = async () => {
  try {
    const recipesCollection = collection(db, "userrecipie");
    const querySnapshot = await getDocs(recipesCollection);
    const recipes = [];

    querySnapshot.forEach((doc) => {
      recipes.push({ id: doc.id, ...doc.data() });
    });

    console.log("Fetched Recipes:", recipes);
    displayRecipes(recipes);

    window.allRecipes = recipes;  
  } catch (error) {
    console.error("Error fetching recipes:", error);
  }
};


const displayRecipes = (recipes) => {
  const recipeContainer = document.querySelector(".recipes_cards_display");

  recipeContainer.innerHTML = "";

  if (recipes.length === 0) {
    recipeContainer.innerHTML = "<p>No recipes found.</p>";
    return;
  }

  recipes.forEach((recipe) => {
    const recipeCard = document.createElement("div");
    recipeCard.classList.add("recipe_card");

    recipeCard.innerHTML = `
      <div class="recipe_content">
          <h5>${recipe.recipeTitle}</h5>
          <div class="rating">
              <p><strong>Servings:</strong> ${recipe.servings}</p>
          </div>
          <p><strong>Time:</strong> ${recipe.time} minutes</p>
          <p class="recipe_desc">${recipe.description}</p>
          <button class="recipe_btn" data-id="${recipe.id}">
              <i class="fa-solid fa-arrow-right"></i> View Recipe
          </button>
      </div>
      <img src="${recipe.imageURL}" alt="${recipe.recipeTitle}" class="recipe_img">
    `;

    recipeContainer.appendChild(recipeCard);
  });


  document.querySelectorAll(".recipe_btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      const recipeId = event.target.getAttribute("data-id");
      viewRecipe(recipeId);
    });
  });
};


const viewRecipe = (recipeId) => {
  if (recipeId) {
    window.location.href = `/public-src/Assets/Homepage/html/fullViewRecipe.html?id=${recipeId}`;
  } else {
    console.error("Invalid Recipe ID");
  }
};


// **Search Function**//
const searchRecipes = () => {
  const searchInput = document.querySelector("#searchInput").value.toLowerCase();
  const filteredRecipes = window.allRecipes.filter((recipe) => 
    recipe.recipeTitle.toLowerCase().includes(searchInput) ||
    recipe.description.toLowerCase().includes(searchInput)
  );

  displayRecipes(filteredRecipes);
};

// **Filter Recipes by Category**
const filterByCategory = (category) => {
  const filteredRecipes = window.allRecipes.filter(
    (recipe) => recipe.category && recipe.category.toLowerCase() === category.toLowerCase()
  );
  displayRecipes(filteredRecipes);
};

document.addEventListener("DOMContentLoaded", () => {
  fetchRecipes();
  document.querySelector("#searchInput").addEventListener("input", searchRecipes);

  document.querySelectorAll(".category_btn").forEach((button) => {
    button.addEventListener("click", () => {
      const selectedCategory = button.textContent.trim();
      filterByCategory(selectedCategory);
    });
  });
});


/********************************/
/***** Chef Profiling ***********/
/********************************/

var chefsProfile = [
  {
    name: "John Doe",
    tag: "perfect Food Nutritionist",
    image: "./public-src/Assets/Homepage/assets/chefs/chef1.jpg",
    bio: "John Doe Miller is a really good and top rated chef who serve the community and sharing her recipes since 4 years, having above 50+ delicious recipes.",
    rating: `<i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>`,
    reviews: "121 reviews",
  },
  {
    name: "Aina batool",
    tag: "Desi Cuisine expert",
    image: "./public-src/Assets/Homepage/assets/chefs/chef6.jpg",
    bio: "Aina Batool is our desi cuisine expert chef and one of the top rated chef, having above 100+ delicious recipes.",
    rating: `<i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>`,
    reviews: "234 reviews",
  },
  {
    name: "Janny shen",
    tag: "Master Chef of Chinese",
    image: "./public-src/Assets/Homepage/assets/chefs/chef11.jpg",
    bio: "Janny Shen is a really good and people's favorite chef who serve and sharing her recipes since 2 years, having above 40+ delicious recipes.",
    rating: `<i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>`,
    reviews: "220 reviews",
  },
  {
    name: "Iliana Dcruz",
    tag: "Bakery items expert",
    image: "./public-src/Assets/Homepage/assets/chefs/chef12.jpg",
    bio: "Iliana Dcruz is favorite chef of anyone who love to eat bakery items, she connect with us since 2 years, having above 50+ delicious recipes.",
    rating: `<i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>`,
    reviews: "210 reviews",
  },
];

for (let val = 0; val < chefsProfile.length; val++) {
  let chefsDisplay = document.querySelector(".chefs_display");
  let chefCard = document.createElement("div");
  chefCard.setAttribute("class", "chef_profile");
  let chefContent = `<img src="${chefsProfile[val].image}" class="chef_img">
                    <div class="chef_content">
                        <h5>${chefsProfile[val].name}</h5>
                        <p>(${chefsProfile[val].tag})</p>
                        <div class="ratings">
                            ${chefsProfile[val].rating}
                            <span>${chefsProfile[val].reviews}</span>
                        </div>
                    </div>
                    <div class="chef_links">
                        <i class="fa-regular fa-heart"></i>
                        <button class="chef_btn">View Profile <i class="fa-solid fa-arrow-right"></i></button>
                    </div>`;

  chefCard.innerHTML = chefContent;
  chefsDisplay.appendChild(chefCard);
}

document.querySelectorAll(".chef_btn")?.forEach((button, val) => {
  button.addEventListener("click", () => {
    document.querySelector(".chef_preview").style.display = "flex";

    document.querySelector(".single_profile").innerHTML = `
    <div class="single_profile">
            <div class="chef_image">
                <img src="${chefsProfile[val].image}">
            </div>
            <h5 class="chefname">${chefsProfile[val].name}</h5>
            <small class="cheftag">(${chefsProfile[val].tag})</small>
            <p class="chefbio">${chefsProfile[val].bio}</p>
            <div class="chef_rating">
                <div class="stars">
                ${chefsProfile[val].rating}
                </div>
                <div class="chef_review">${chefsProfile[val].reviews}</div>
            </div>
            <div class="chef_social">
                <i class="fa-brands fa-facebook-f"></i>
                <i class="fa-brands fa-instagram"></i>
                <i class="fa-brands fa-linkedin"></i>
            </div>
        </div>
    `;
  });
  document.querySelector(".fa-close")?.addEventListener("click", () => {
    document.querySelector(".chef_preview").style.display = "none";
  });
});
