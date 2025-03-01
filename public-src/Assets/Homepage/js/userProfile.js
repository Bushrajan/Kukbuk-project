
import {
  onAuthStateChanged,
  doc,
  auth,
  getDoc,
  deleteDoc,
  db,
  signOut,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updateDoc,
  sendEmailVerification,
  setDoc,
} from "../../../firebase/firebase-config.js";

/****************************************************/
/*************** Update Profile data ***************/
/****************************************************/

const updateProfileUI = (userData) => {
  document.getElementById("prof-username").value = userData.username || "";
  document.getElementById("prof-category").value = userData.category || "";
  document.getElementById("prof-email").value = userData.email || "";
  document.getElementById("prof-gender").value = userData.gender || "";

  // Profile image update
  const userPic = document.querySelector(".user_pic");
  if (userData.profileImage) {
    userPic.src = userData.profileImage;
  } else {
    userPic.src = "/public-src/Assets/Homepage/assets/logo&profiles/user.png";
  }
};

onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log("User is logged in:", user.uid);

    const userRef = doc(db, "Users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      updateProfileUI(userSnap.data());
    } else {
      console.log("User data not found in Firestore.");
    }
  } else {
    console.log("User is logged out.");
    window.location.href = "index.html";
  }
});

/****************************************************/
/********** Upload Image to Cloudinary & Firestore **********/
/****************************************************/

const uploadImg = async () => {
  const fileInput = document.getElementById("image");
  const selectedImg = fileInput.files[0];

  if (!selectedImg) {
    alert("Please select an image first.");
    return;
  }

  const formData = new FormData();
  formData.append("file", selectedImg);
  formData.append("upload_preset", "User-images");
  formData.append("cloud_name", "dizomf7uh");

  try {
    const response = await fetch('https://api.cloudinary.com/v1_1/dizomf7uh/image/upload', {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    console.log("Uploaded Image URL:", data.secure_url);

    if (!data.secure_url) {
      throw new Error("Failed to upload image.");
    }

    // Update Firestore with the new image URL
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, "Users", user.uid);
      await updateDoc(userRef, {
        profileImage: data.secure_url,
      });

      // Update UI with the new image
      document.querySelector(".user_pic").src = data.secure_url;
      alert("Profile picture updated successfully!");
    } else {
      alert("User not found.");
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    alert("Error uploading image: " + error.message);
  }
};

document.querySelector("#uploadBtn").addEventListener("click", uploadImg);

/****************************************************/
/*************** Update Profile Popup ***************/
/****************************************************/

const updateUserpopUp = () => {
  document.querySelector(".change_profile_popup").style.display = "flex";
};
document
  .querySelector(".update_user")
  ?.addEventListener("click", updateUserpopUp);

const userPopupClose = () => {
  document.querySelector(".change_profile_popup").style.display = "none";
};
document
  .querySelector(".change_profile_popup .fa-close")
  ?.addEventListener("click", userPopupClose);

// Function to Update User Profile
const updateUserProfile = async (event) => {
  event.preventDefault();
  const user = auth.currentUser;
  const newEmail = document.getElementById("email").value;
  const newUsername = document.getElementById("name").value;
  const newCategory = document.getElementById("category").value;
  const newGender = document.getElementById("gender").value;

  if (!user) return alert("No user logged in.");

  try {
    const currentEmail = user.email;

    // Re-authenticate user before updating email
    const currentPassword = prompt("Please enter your password to confirm changes:");
    const credential = EmailAuthProvider.credential(currentEmail, currentPassword);
    await reauthenticateWithCredential(user, credential);

    const userRef = doc(db, "Users", user.uid);

    // If email is changed, store it in Firestore under 'pendingEmail'
    if (newEmail !== currentEmail) {
      await updateDoc(userRef, {
        pendingEmail: newEmail, // Save the new email in Firestore but not in Firebase Auth
      });

      // Send verification email to the new email
      const actionCodeSettings = {
        url: window.location.replace('./public-src/Assets/User'), // Redirect to your site after verification
        handleCodeInApp: true,
      };
      await sendEmailVerification(user, actionCodeSettings);

      alert("A verification email has been sent to your new email. Please verify it before login.");
    }

    // Update other user details in Firestore
    await updateDoc(userRef, {
      username: newUsername,
      category: newCategory,
      gender: newGender,
    });

    alert("Profile updated successfully! You will be logged out now.");
    await signOut(auth);
    document.querySelector(".change_profile_popup").style.display = "none";
  } catch (error) {
    console.error("Error updating profile:", error);
    alert("Error updating profile: " + error.message);
  }
};

document.querySelector(".save_profile")?.addEventListener("click", updateUserProfile);

/****************************************************/
/*************** Update Password Popup ***************/
/****************************************************/


const showPopup = () => {
  document.querySelector(".change_password").style.display = "flex";
};
const closePopup = () => {
  document.querySelector(".change_password").style.display = "none";
};
document
  .querySelector(".change_password .fa-close")
  ?.addEventListener("click", closePopup);

document.getElementById("changePswd")?.addEventListener("click", showPopup);

// Function to Update Password
const currentPasswordInput = document.getElementById("current-password");
const newPasswordInput = document.getElementById("new-password");
const confirmPasswordInput = document.getElementById("confirm-password");

const updateUserPassword = async () => {
  const user = auth.currentUser;
  const currentPassword = currentPasswordInput.value;
  const newPassword = newPasswordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  if (!currentPassword || !newPassword || !confirmPassword) {
    alert("Please fill in all fields.");
    return;
  }

  if (newPassword !== confirmPassword) {
    alert("New passwords do not match!");
    return;
  }

  if (newPassword.length < 6) {
    alert("Password must be at least 6 characters long!");
    return;
  }

  try {
    // Re-authenticate User Before Updating Password
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    await reauthenticateWithCredential(user, credential);

    // Update Password
    await updatePassword(user, newPassword);
    alert("Password updated successfully!");

    // Clear Fields After Success
    currentPasswordInput.value = "";
    newPasswordInput.value = "";
    confirmPasswordInput.value = "";
  } catch (error) {
    console.error("Password update error:", error);
    alert("Error: " + error.message);
  }
};

document.getElementById("change-password-btn")?.addEventListener("click", updateUserPassword);

/****************************************************/
/*************** Logout User Function ***************/
/****************************************************/
const signOutUser = async () => {
  try {
    await signOut(auth);
    alert("You have been logged out successfully!");
    window.location.href = "/index.html";
  } catch (error) {
    console.error("Logout Error:", error.message);
  }
};
document.getElementById("logoutUser").addEventListener("click", signOutUser);

/****************************************************/
/*************** Delete User Function ***************/
/****************************************************/

const deleteUserAccount = async () => {
  const user = auth.currentUser;
  if (!user) return alert("No user logged in.");

  const confirmation = confirm("Are you sure you want to delete your account? This action is irreversible.");
  if (!confirmation) return;

  try {
    await deleteDoc(doc(db, "Users", user.uid));
    await user.delete();
    alert("Account deleted successfully.");
    window.location.href = "/index.html";
  } catch (error) {
    console.error("Error deleting account:", error);
    alert("Error: " + error.message);
  }
};

document.getElementById("deleteUser")?.addEventListener("click", deleteUserAccount);