import { authorize } from "./firebase-config";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

// Sign Up
const signUpForm = document.getElementById("sign-up-form");
signUpForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("sign-up-email").value;
    const password = document.getElementById("sign-up-password").value;
    const repeatPassword = document.getElementById("sign-up-password-repeat").value;
    const signupErrorMessage = document.getElementById("sign-up-error");

    // Check for password matching when registering
    if (password !== repeatPassword) {
        signupErrorMessage.textContent = "Passwords do not match. Please try again.";
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(authorize, email, password);
        const user = userCredential.user;
        console.log("User signed up:", user);
        signUpForm.reset();
        signupErrorMessage.textContent = ""
    } catch (error) {
        console.error("Error signing up:", error);
    }
});

// Login
const loginForm = document.getElementById("login-form");
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    const loginErrorMessage = document.getElementById("login-error");

    try {
        const userCredential = await signInWithEmailAndPassword(authorize, email, password);
        const user = userCredential.user;
        console.log("User logged in:", user);
        loginForm.reset();
        // clear error message
        loginErrorMessage.textContent = ""
    } catch (error) {
        console.error("Error logging in:", error);
        loginErrorMessage.textContent = "Unrecognized login information. Please try again.";
    }
});

