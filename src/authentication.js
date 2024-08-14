import { authorize, db } from "./firebase-config";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

// Retreive user data from Firestore
async function getUserData(uid) {
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
        return userDoc.data();
    } else {
        return null;
    }
}

// Sign Up
let submitFlag = false;

document.addEventListener("DOMContentLoaded", () => {
    const signUpForm = document.getElementById("signup-form");

    if (signUpForm) {
        signUpForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (submitFlag) return;
            submitFlag = true;

            console.log("Submit event listener triggered.")
            const username = document.getElementById("sign-up-username").value;
            const email = document.getElementById("sign-up-email").value;
            const password = document.getElementById("sign-up-password").value;
            const repeatPassword = document.getElementById("sign-up-password-repeat").value;
            const signupErrorMessage = document.getElementById("sign-up-error");

            // Check for password matching when registering
            if (password !== repeatPassword) {
                signupErrorMessage.textContent = "Passwords do not match. Please try again.";
                submitFlag = false;
                return;
            }

            try {
                const userCredential = await createUserWithEmailAndPassword(authorize, email, password);
                const user = userCredential.user;
                console.log("User signed up:", user);

                // Add user data to Firestore
                await setDoc(doc(db, "users", user.uid), {
                    username: username,
                    email: user.email,
                    createdAt: new Date()
                });
                // Create agenda subcollection for each user
                const plannerRef = doc(db, "users", user.uid, "agenda", "default");
                await setDoc(plannerRef, {
                    // Initialize empty workout array in planner to populate
                    workouts: []
                }, { merge: true});
                console.log("User ID and planner stored in database.")

                signUpForm.reset();
                signupErrorMessage.textContent = ""
                // Redirect user to homepage after successful registration
                window.location.href = "homepage.html";
            } catch (error) {
                console.error("Error signing up:", error);
            } finally {
                submitFlag = false;
            }
        });
    }

    // Function to update navbar based on user's auth status
    function updateNavBasedonAuth(user) {
        const authLinks = document.getElementById("auth-links");
        const userInfo = document.getElementById("user-info");

        if (!authLinks || !userInfo) {
            return;
        }

        const usernamePlaceholder = document.getElementById("username-placeholder");

        if (user) {
            authLinks.classList.add("d-none");
            userInfo.classList.remove("d-none");

            getUserData(user.uid).then(userData => {
                if (userData && usernamePlaceholder) {
                    usernamePlaceholder.textContent = userData.username;
                }
            });
        } else {
            authLinks.classList.remove("d-none");
            userInfo.classList.add("d-none");
        }
    }

    // Event listener to change navbar based on auth state
    authorize.onAuthStateChanged((user) => {
        updateNavBasedonAuth(user);
    });

    // Event listener for logout button 
    const logoutLink = document.getElementById("logout-link");

    if (logoutLink) {
        logoutLink.addEventListener("click", (e) => {
            e.preventDefault();
            authorize.signOut().then(() => {
                updateNavBasedonAuth(null);
            }).catch((error) => {
                console.error("Error logging out:", error);
            });
        });
    } else {
        console.log("Logout link not found.");
    }
    // Login
    const loginForm = document.getElementById("login-form");

    if (loginForm) {
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
                // Redirect user to homepage after successful login
                window.location.href = "homepage.html";
            } catch (error) {
                console.error("Error logging in:", error);
                loginErrorMessage.textContent = "Unrecognized login information. Please try again.";
            }
        });
    }
});
