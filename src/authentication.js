import { authorize } from "./firebase-config";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

// Sign Up
const signUpForm = document.getElementById("sign-up-form");
signUpForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("sign-up-email").value;
    const password = document.getElementById("sign-up-password").value;

    try {
        const userCredential = await createUserWithEmailAndPassword(authorize, email, password);
        const user = userCredential.user;
        console.log("User signed up:", user);
        signUpForm.reset();
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
    const errorMessage = document.getElementById("login-error");

    try {
        const userCredential = await signInWithEmailAndPassword(authorize, email, password);
        const user = userCredential.user;
        console.log("User logged in:", user);
        loginForm.reset();
        // clear error message
        errorMessage.textContent = ""
    } catch (error) {
        console.error("Error logging in:", error);
        errorMessage.textContent = "Unrecognized login information. Please try again.";
    }
});

