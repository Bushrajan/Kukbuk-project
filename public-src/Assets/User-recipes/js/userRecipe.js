
import {
  auth,
  onAuthStateChanged,
  db,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  onSnapshot,
  updateDoc,
  deleteDoc,
}
  from "../../../firebase/firebase-config.js";
//  , query, orderBy,

/***********************************************/
/*********** Overall function working **********/
/***********************************************/

document?.addEventListener("DOMContentLoaded", function (event) {
  event.preventDefault();
  let userCollection = [];
  let favouriteCollection = [];

  /**************************************************/
  /*********** Fetch and display recipes ************/
  /**************************************************/

  let userRecipes = [];

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      console.log("User Login:", user);
      try {
        console.log("User ID:", user.uid);

        const userRef = collection(db, "userRecipes");
        const querySnapshot = await getDocs(userRef);

        userRecipes = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          userRecipes.push(data);
          displayCards(userRecipes, "userCollection");
        });
      }

      catch (error) {
        console.error(error.message);
      }
    }

    else {
      console.log("No user is signed in.");
    }
  });
  console.log(userRecipes);

  // xxxxxxxxxxxxxxxxxxxxxxxxxx cards display
  const displayCards = (collection, containerId) => {
    const container = document.getElementById(containerId);
    if (!container) {
      // console.log("Container not found:", containerId);
      return;
    }

    console.log(`Rendering ${collection.length} cards in ${containerId}`); //  Debugging


    container.innerHTML = "";

    collection.forEach((recipe, index) => {
      const card = document.createElement("div");
      card.setAttribute("class", "col");
      card.innerHTML = `
    <div class="recipe card recipie-card">
        <div class="recipe-img-div">
            <img src="${recipe.imageURL
        }" class="recipe_img" width="200px" height="200px">
        </div>
        <div class="recipe_content">
            <h4 class="h4">${recipe.recipeTitle}</h4>
            <div class="d-flex text-center mt-4 flex-column align-items-center justify-content-between mt-lg-4 mb-4 ">
                <div class="d-flex text-center flex-column align-items-center justify-content-between mt-lg-4 mb-4 ">
                    <div class="recipie-span-div d-flex align-items-center justify-content-center">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 48 48">
                                <defs>
                                    <mask id="ipSTag0">
                                        <g fill="none" stroke-linejoin="round" stroke-width="4">
                                            <path fill="#fff" stroke="#fff"
                                                d="M8 44V6a2 2 0 0 1 2-2h28a2 2 0 0 1 2 2v38l-16-8.273z" />
                                            <path stroke="#000" stroke-linecap="round" d="M16 18h16" />
                                        </g>
                                    </mask>
                                </defs>
                                <path fill="#e86209" d="M0 0h48v48H0z" mask="url(#ipSTag0)" />
                            </svg> Category : &nbsp;
                        </div>&nbsp;
                        <span>
                            <small><span class="recipie-span">${recipe.category.join(
          ", "
        )}</span></small>
                        </span>
                    </div>
                    <div class="recipie-span-div d-flex align-items-center justify-content-center">
                        <div>&nbsp;
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 2048 2048">
                                <path fill="#e86209"
                                    d="M1280 64q0 179 66 330t190 278t190 278t66 330q0 106-27 204t-78 183t-120 156t-155 120t-184 77t-204 28t-204-27t-183-78t-156-120t-120-155t-77-184t-28-204q0-84 18-165t52-155t84-141t113-121q7 38 19 78t28 80t38 76t46 67q20 25 52 25q27 0 45-19t19-46q0-11-3-20t-10-18q-28-41-49-81t-37-82t-23-87t-8-95q0-119 45-224t124-183T992 46t224-46h64zm-256 1856q133 0 249-50t204-137t137-203t50-250q0-151-56-281t-162-236q-130-131-204-289t-88-342q-83 11-153 50t-123 99t-81 135t-29 160q0 78 23 141t68 126q19 26 29 54t11 62q0 40-15 75t-42 61t-61 42t-75 15q-46 0-81-17t-62-46t-48-65t-40-72q-46 73-68 157t-23 171q0 133 50 249t137 204t203 137t250 50" />
                        </div>&nbsp;Calories : &nbsp;
                        <span>
                            <small><span class="recipie-span">${recipe.calories
        }</span></small>
                        </span>
                    </div>
                    <div class="recipie-span-div d-flex align-items-center justify-content-center">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
                                <path fill="#e86209" fill-rule="evenodd"
                                    d="M7 .103a.75.75 0 0 1 .75.75v1.04A7 7 0 0 1 14 8.854a1.5 1.5 0 0 1-1.5 1.5h-11a1.5 1.5 0 0 1-1.5-1.5a7 7 0 0 1 6.25-6.96V.854A.75.75 0 0 1 7 .103M.78 11.75a.75.75 0 0 0 0 1.5h12.44a.75.75 0 0 0 0-1.5z"
                                    clip-rule="evenodd" />
                            </svg>
                            &nbsp;Serving : &nbsp;
                        </div>&nbsp;
                        <span>

                            <small><span class="recipie-span">${recipe.servings
        }</span></small>
                        </span>
                    </div>
                    <br />
                    <p class="paara">${recipe.description}</p>
                    <div class="recipe_links d-flex flex-lg-row flex-column justify-content-center align-items-center">
                        <div class="text-center">
                    
<button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modal-${index}"
    onclick="populateModal(this)">
    View Recipe
    </button>
    <br/> 
    </div>
                    </div>
                    <div class="recipe_info">
                        <span>
                            <img src="../asset/logo_imgs/heart.png" alt="img" width="18px"
                                onclick="addToFavorites(${index})"> 2k Likes
                        </span>
                        <span>
                            <img src="../asset/logo_imgs/material-symbols--comment-outline.png" alt="img" width="18px">
                            243
                        </span>
                        <span>

                            <img src="../asset/logo_imgs/icons8-time-50.png" alt="img" width="18px">
                            <span>${recipe.time} Min</span>
                        </span>
                    </div>
                    <br />

                    <div class="text-center">

                        <button href="#" class="btn mb-3 recipiebtn_curd text-light"
                            onclick="deleteCard(${index}, '${containerId}')">Delete Recipe</button>

                      <button href="#" class="btn mb-3 recipiebtn_curd text-light" onclick="updateCard(${index}, 'userCollection')">Update Recipe</button>

                    </div>
                </div>
            </div>
        </div>



     
        <div class="modal fade" id="modal-${index}" tabindex="-1" aria-labelledby="modalLabel-${index}" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="modalLabel-${index}">${recipe.recipeTitle}</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <h5 class="mt-4 mb-2">Category</h5>
                <p class="mt-2 mb-2">${recipe.category.join(", ")}</p>

                <h5 class="mt-2 mb-2">Ingridients</h5>
                <p class="mt-2 mb-2">${recipe.cookingIngredients}</p>

                <h5 class="mt-2 mb-2">Cooking Steps</h5>
                <p class="mt-2 mb-2">${recipe.cookingSteps}</p>

                <h5 class="mt-2 mb-2">Description</h5>
                <p class="mt-2 mb-2">${recipe.description}</p>

                <h5 class="mt-2 mb-2">Calories</h5>
                <p class="mt-2 mb-2">${recipe.calories} cal</p>

                <h5 class="mt-2 mb-2">Time</h5>
                <p class="mt-2 mb-2">${recipe.time} min</p>

                <h5 class="mt-2 mb-2">Servings</h5>
                <p class="mt-2 mb-2">${recipe.servings} serving</p>
            </div>
        </div>
    </div>
</div>

        `;
      container.appendChild(card);
    });
  };





  window.populateModal = (button) => {
    const card = button.closest(".recipe"); // Find the parent card
    const modal = card.querySelector(".modal"); // Find the modal inside the card

    modal.querySelector(".modal-title").textContent = card.querySelector(".h4").textContent;
  };



  window.document?.addEventListener("DOMContentLoaded", (event) => {
    event.preventDefault();
    setUpRealTimeListeners();
  });




  /***********************************************/
  /*********** Delete Card Function **************/
  /***********************************************/
  
  window.deleteCard = async (index, containerId) => {
    try {
      const recipe = userCollection[index];

      // Delete recipe from Firestore
      await deleteDoc(doc(db, "userRecipes", recipe.id));

      console.log("Recipe deleted from Firestore successfully!");

      // Remove recipe from the local collection
      userCollection.splice(index, 1);

      // Update the UI
      displayCards(userCollection, containerId);

    } catch (error) {
      console.error("Error deleting recipe: ", error);
    }
  };


  // Function to set up real-time listeners
  const setUpRealTimeListeners = () => {
    const userCollectionRef = collection(db, "userRecipes");
    const favouriteCollectionRef = collection(db, "favouriterecipie-card");

    // Listen for real-time updates in userCollection
    onSnapshot(userCollectionRef, (snapshot) => {
      userCollection = [];
      snapshot.forEach((doc) => {
        userCollection.push({ id: doc.id, ...doc.data() });
      });
      displayCards(userCollection, "userCollection");
    });

  };

  setUpRealTimeListeners();



  /***********************************************/
  /*********** Update Card Function **************/
  /***********************************************/

  window.updateCard = (index, containerId) => {
    const recipe = userCollection[index];
    document.getElementById("recipeIndex").value = index;
    document.getElementById("recipeTitle").value = recipe.recipeTitle;
    document.getElementById("preparationTime").value = recipe.time;
    document.getElementById("servings").value = recipe.servings;
    document.getElementById("description").value = recipe.description;
    document.getElementById("category").value = recipe.category.join(", ");
    document.getElementById("calories").value = recipe.calories;
    document.getElementById("cookingSteps").value = recipe.cookingSteps.join(", ");
    document.getElementById("cookingIngredients").value = recipe.cookingIngredients.join(", ");

    const updateRecipeModal = new bootstrap.Modal(document.getElementById("updateRecipeModal"));
    updateRecipeModal.show();
  };

  document.getElementById("updateRecipeForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const index = document.getElementById("recipeIndex").value;
    const recipe = {
      recipeTitle: document.getElementById("recipeTitle").value,
      time: document.getElementById("preparationTime").value,
      servings: document.getElementById("servings").value,
      description: document.getElementById("description").value,
      category: document.getElementById("category").value.split(",").map(cat => cat.trim()),
      calories: document.getElementById("calories").value,
      cookingSteps: document.getElementById("cookingSteps").value.split(",").map(step => step.trim()),
      cookingIngredients: document.getElementById("cookingIngredients").value.split(",").map(ingredient => ingredient.trim()),
    };

    try {
      await updateDoc(doc(db, "userRecipes", userCollection[index].id), recipe);
      console.log("Recipe updated successfully!", recipe);

      // Update UI directly
      document.querySelectorAll(".recipe")[index].querySelector(".h4").textContent = recipe.recipeTitle;
      document.querySelectorAll(".recipe")[index].querySelector(".paara").textContent = recipe.description;

      // Hide the modal
      const updateRecipeModal = bootstrap.Modal.getInstance(document.getElementById("updateRecipeModal"));
      updateRecipeModal.hide();
    } catch (error) {
      console.error("Error updating recipe in Firestore: ", error);
    }
  });



  /***********************************************/
  /*********** Add to Favorites ************/
  /***********************************************/

  window.addToFavorites = async (index) => {
    try {
      const recipe = userRecipes[index]; // ✅ Corrected: using userRecipes
      if (!recipe) {
        console.error("Recipe not found at index:", index);
        return;
      }

      const favRef = doc(db, "favouriterecipie-card", recipe.recipeTitle); // ✅ Unique ID from recipe title

      await setDoc(favRef, recipe);
      console.log("Recipe added to favorites successfully!");

      favouriteCollection.push(recipe);
      displayFavoriteCard(recipe, favouriteCollection.length - 1);
    } catch (error) {
      console.error("Error adding recipe to favorites: ", error);
    }
  };

  document.addEventListener("DOMContentLoaded", (event) => {
    setUpRealTimeListeners();
  });




  /***********************************************/
  /*********** Display Favorite Card *************/
  /***********************************************/
  const displayFavoriteCard = (recipe) => {
    const favouriteUserCollection = document.getElementById("favouriteusercollection");

    if (!favouriteUserCollection) {
      return;
    }

    const card = document.createElement("div");
    card.setAttribute("class", "col");
    card.innerHTML = `
      <div class="recipe card recipie-card recipie-card2">
        <div class="recipe-img-div">
          <img src="${recipe.imageURL
      }" class="recipe_img" width="200px" height="200px">
        </div>
        <div class="recipe_content">
          <h4 class="h4">${recipe.recipeTitle}</h4>
                   <div class="d-flex text-center mt-4 flex-column align-items-center justify-content-between mt-lg-4 mb-4 ">
                <div class="d-flex text-center flex-column align-items-center justify-content-between mt-lg-4 mb-4 ">
                    <div class="recipie-span-div d-flex align-items-center justify-content-center">
                        <div> <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 48 48">
                                <defs>
                                    <mask id="ipSTag0">
                                        <g fill="none" stroke-linejoin="round" stroke-width="4">
                                            <path fill="#fff" stroke="#fff"
                                                d="M8 44V6a2 2 0 0 1 2-2h28a2 2 0 0 1 2 2v38l-16-8.273z" />
                                            <path stroke="#000" stroke-linecap="round" d="M16 18h16" />
                                        </g>
                                    </mask>
                                </defs>
                                <path fill="#e86209" d="M0 0h48v48H0z" mask="url(#ipSTag0)" />
                            </svg> Category : &nbsp; </div>&nbsp;
                        <span>

                            <small><span class="recipie-span">${recipe.category.join(
        ", "
      )}</span></small>
                        </span>

                    </div>
                    <div class="recipie-span-div d-flex align-items-center justify-content-center">

                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 2048 2048">
                                <path fill="#e86209"
                                    d="M1280 64q0 179 66 330t190 278t190 278t66 330q0 106-27 204t-78 183t-120 156t-155 120t-184 77t-204 28t-204-27t-183-78t-156-120t-120-155t-77-184t-28-204q0-84 18-165t52-155t84-141t113-121q7 38 19 78t28 80t38 76t46 67q20 25 52 25q27 0 45-19t19-46q0-11-3-20t-10-18q-28-41-49-81t-37-82t-23-87t-8-95q0-119 45-224t124-183T992 46t224-46h64zm-256 1856q133 0 249-50t204-137t137-203t50-250q0-151-56-281t-162-236q-130-131-204-289t-88-342q-83 11-153 50t-123 99t-81 135t-29 160q0 78 23 141t68 126q19 26 29 54t11 62q0 40-15 75t-42 61t-61 42t-75 15q-46 0-81-17t-62-46t-48-65t-40-72q-46 73-68 157t-23 171q0 133 50 249t137 204t203 137t250 50" />
                            </svg>
                            Calories : &nbsp;
                        </div>&nbsp;
                        <span>

                            <small><span class="recipie-span">${recipe.calories
      }</span></small>
                        </span>
                    </div>
                    <div class="recipie-span-div d-flex align-items-center justify-content-center">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
                                <path fill="#e86209" fill-rule="evenodd"
                                    d="M7 .103a.75.75 0 0 1 .75.75v1.04A7 7 0 0 1 14 8.854a1.5 1.5 0 0 1-1.5 1.5h-11a1.5 1.5 0 0 1-1.5-1.5a7 7 0 0 1 6.25-6.96V.854A.75.75 0 0 1 7 .103M.78 11.75a.75.75 0 0 0 0 1.5h12.44a.75.75 0 0 0 0-1.5z"
                                    clip-rule="evenodd" />
                            </svg>
                            Serving : &nbsp;
                        </div>&nbsp;
                        <span>

                            <small><span class="recipie-span">${recipe.servings
      }</span></small>
                        </span>
                    </div>
            <p class="paara2">${recipe.description}</p>
            <div class="recipe_links d-flex flex-lg-row flex-column justify-content-center align-items-center">
              <div class=" d-flex flex-lg-row justify-content-between ">
                <button>
                <a href='/public-src/Assets/all-recipes/html/fullview.html' class="text-decoration-none text-light">View Recipe</a>
                </button>&nbsp;&nbsp;
               
               
               
                </div>
            </div> 
            <div class="recipe_info mt-2">
           
              <span>
                <img src="../asset/logo_imgs/heart.png" alt="img" width="18px" > 2k Likes
              </span>
              <span>
                <img src="../asset/logo_imgs/material-symbols--comment-outline.png" alt="img" width="18px"> 243
              </span>
              <span>
                <img src="../asset/logo_imgs/icons8-time-50.png" alt="img" width="18px">
                <span>${recipe.time} Min</span>
              </span>
            </div>
            </div>
        </div>
      </div>
    `;

    favouriteUserCollection.appendChild(card);
  };


});