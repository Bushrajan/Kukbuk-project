import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  doc, setDoc, db, serverTimestamp
} from "../../../firebase/firebase-config.js";

// ----------------------------------------------------for user signup


const register = async (e) => {
  e.preventDefault();

  const username = document.getElementById("name")?.value;
  const category = document.getElementById("category")?.value;
  const gender = document.getElementById("gender")?.value;
  const email = document.getElementById("email")?.value;
  const password = document.getElementById("password")?.value;

  if (!username || !category || !email || !password) {
    console.error("Please fill in all fields.");
    return;
  }

  try {
    let userCredential = await createUserWithEmailAndPassword(auth, email, password);
    let user = userCredential?.user;

    if (!user) {
      console.error("User creation failed.");
      return;
    }

    // Send email verification
    await sendEmailVerification(user);
    alert("Verification email sent. Please verify your email before logging in.");

    // Store user data in Firestore
    await setDoc(doc(db, "Users", user.uid), {
      username,
      category,
      gender,
      email,
      timestamp: serverTimestamp()
    });

    // Redirect after successful signup
    window.location.pathname = "./public-src/Assets/Homepage/html/profile.html";

  } catch (error) {
    console.error("Error:", error.message);
  }
};

document.getElementById("signup")?.addEventListener("submit", register);


// ----------------------------------------------------for user SignIn

const signIn = async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    let userCredintial = await signInWithEmailAndPassword(auth, email, password);

    let user = userCredintial?.user;
    console.log(user);

    await sendEmailVerification(auth.currentUser);

    alert("Verification email send to your account, check your email");

    if (userCredintial?.user) window.location.pathname = "/";
  } catch (error) {
    console.log(error.message);
  }
};

document.getElementById("login-form")?.addEventListener("submit", signIn);

// ---------------------------------------------------- Google Login

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

const _sigInWithGoogle = async () => {
  try {
    await signOut(auth);
    console.log("User signed out before sign-in attempt.");

    const result = await signInWithPopup(auth, provider);
    console.log("User signed in:", result.user);
  } catch (error) {
    console.error("Google Sign-In Error:", error.message);
  }
};

document
  .getElementById("signinWithGoogle")
  ?.addEventListener("click", _sigInWithGoogle);

// ---------------------------------------------------- Forgot password link

const _fPassword = async () => {
  try {
    const email = document.getElementById("email").value;
    await sendPasswordResetEmail(auth, email);

    alert("Reset password send to your email");

  } catch (error) {
    console.log(error);

  }
}

document.getElementById("forgot_password")?.addEventListener("click", _fPassword);