
import { db, addDoc, collection, serverTimestamp } from '../../../firebase/firebase-config.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCMeJCTXbdJorjOdi-5woYwoG6rb7ddDDQ",
  authDomain: "kukbuk-project-45362.firebaseapp.com",
  projectId: "kukbuk-project-45362",
  storageBucket: "kukbuk-project-45362.firebasestorage.app",
  messagingSenderId: "695377977253",
  appId: "1:695377977253:web:e4bf823163001937c6924c",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


/*********************************************************************/
/********** Function to submit all data into firestore ***************/
/*********************************************************************/


document?.addEventListener('DOMContentLoaded', function () {
  const text = document.getElementById('text');
  const inputField = document.getElementById('image');
  const filePreview = document.getElementById('filePreview');
  const changeButton = document.getElementById('changeButton');
  const form = document.getElementById('recipie-form');

  const ingredientInput = document.getElementById('ingredientInput');
  const addIngredientButton = document.getElementById('addIngredient');
  const ingredientList = document.getElementById('ingredientList');
  const stepInput = document.getElementById('floatingTextarea2');
  const addStepButton = document.getElementById('addStep');
  const stepList = document.getElementById('stepList');

  const popupBox = document.getElementById('popupBox');
  const backgroundPopupBox = document.getElementById('backgroundpopupbox');
  const tickImage = document.getElementById('tickImage');
  const validationModal = document.getElementById('validationModal');


  /*************************************************/
  /*** Function to how add image from the file******/
  /*************************************************/

  text?.addEventListener('click', function () {
    inputField?.click();
  });

  inputField?.addEventListener('change', function () {
    const file = inputField.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      const fileURL = e.target.result;
      let fileElement;

      if (file.type.startsWith('image/')) {
        fileElement = document.createElement('img');
        fileElement.src = fileURL;
        fileElement.style.width = '200px';
        fileElement.style.height = '200px';
      } else {
        fileElement = document.createElement('p');
        fileElement.textContent = 'Unsupported file type.';
      }

      filePreview.innerHTML = '';
      filePreview.appendChild(fileElement);
      text.style.display = 'none';
      changeButton.classList.remove('hidden');
    };

    reader.readAsDataURL(file);
  });

  changeButton?.addEventListener('click', function () {
    inputField?.click();
  });


  /*************************************************/
  /*** Function to add ingredients to the list******/
  /*************************************************/

  addIngredientButton?.addEventListener('click', function (e) {
    e.preventDefault();
    const ingredient = ingredientInput.value.trim();
    if (ingredient) {
      const listItem = document.createElement('li');
      listItem.textContent = ingredient;
      ingredientList.appendChild(listItem);
      ingredientInput.value = '';
    }
  });


  /*******************************************/
  /****Function to add steps to the list******/
  /*******************************************/

  addStepButton?.addEventListener('click', function (e) {
    e.preventDefault();
    const step = stepInput.value.trim();
    if (step) {
      const listItem = document.createElement('li');
      listItem.textContent = step;
      stepList.appendChild(listItem);
      stepInput.value = '';
    }
  });



  // /***************************************/
  // /******* Form filling funtion **********/
  // /***************************************/

  form?.addEventListener('submit', async function (e) {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) {
      console.error("No user is currently logged in.");
      return;
    }
    const recipeTitle = document.getElementById('recipeTitle').value;
    const recipeCategory = document.querySelectorAll('input[name="form-check-input"]:checked');
    const recipeCategoryValues = Array.from(recipeCategory).map(cb => cb.value);
    const recipeIngredients = Array.from(ingredientList.querySelectorAll('li')).map(li => li.textContent);
    const recipeCookingSteps = Array.from(stepList.querySelectorAll('li')).map(li => li.textContent);
    const recipeDescription = document.getElementById('floatingTextarea3').value;
    const recipeServings = document.getElementById('recipie_serving').value;
    const recipeTime = document.getElementById('recipie_time').value;
    const recipeCalories = document.getElementById('recipie_calories').value;

    // Validation checks
    if (!recipeTitle ||
      !recipeCategoryValues.length
      || !recipeIngredients.length
      || !recipeCookingSteps.length
      || !recipeDescription
      || !recipeServings ||
      !recipeTime ||
      !recipeCalories ||
      !inputField.files.length) {

      validationModal.style.display = 'block';
      return;
    }

    const recipeData = {
      userId: user.uid, // Include userId here
      recipeTitle,
      category: recipeCategoryValues,
      cookingIngredients: recipeIngredients,
      cookingSteps: recipeCookingSteps,
      servings: recipeServings,
      time: recipeTime,
      calories: recipeCalories,
      description: recipeDescription
    };

    console.log("Recipe Data:", recipeData);


    /*********************************************************/
    /******* Image store to cloudinary &  Firestore **********/
    /*********************************************************/

    const selectedImg = inputField.files[0];
    const formData = new FormData();
    formData.append("file", selectedImg);
    formData.append("upload_preset", "profileimg");
    formData.append("cloud_name", "dxnhnrmlr");

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/dxnhnrmlr/image/upload`, {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      // console.log("Uploaded Image Data:", data);


      // Save all data to Firestore
      await saveRecipeToFirestore({
        ...recipeData,
        imageURL: data.secure_url,
        timestamp: serverTimestamp()
      });


      form.reset();
      ingredientList.innerHTML = '';
      stepList.innerHTML = '';
      document.getElementById('filePreview').innerHTML = '';
      text.style.display = 'block';
      changeButton.classList.add('hidden');


      // Show the popup
      backgroundPopupBox.style.display = 'block';
      popupBox.style.display = 'block';
      setTimeout(closePopup, 1500);
    }

    catch (error) {
      console.error("Error in image ", error.message);
    }

  });


  /*********************************************************/
  /*************** save Recipe To Firestore ****************/
  /*********************************************************/

  const saveRecipeToFirestore = async (data) => {
    try {
      await addDoc(collection(doc(db, "userRecipes")), data);
      console.log("Recipe saved ... ");
    }
    catch (error) {
      console.error("Error in saving recipe ", error.message);
    }
  };

  /********************************************/
  /*************** close Popup ****************/
  /********************************************/

  window.closePopup = function () {
    tickImage.style.display = 'block';
    setTimeout(() => {
      window.location.href = './userRecipe.html'; // Redirect to the new file
    }, 1500);
  };


  /***********************************************************************/
  /*************** Function to close the validation modal ****************/
  /***********************************************************************/

  window.closeValidationModal = function () {
    validationModal.style.display = 'none';
  };
});
