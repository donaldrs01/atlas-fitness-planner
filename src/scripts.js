import { db, authorize } from "./firebase-config";
import { collection, getDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";

// Grabs template data from Firestore
async function getWorkoutData(templateName) {
    const docRef = doc(db, "templates", templateName);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        console.error("Data not found");
        return null;
    }
}

// Display template data on webpage 
function displayWorkout(workoutData, clickedElement) {
    if (clickedElement.nextElementSibling && clickedElement.nextElementSibling.classList.contains("workout-details")) {
        return;
    }

    const workoutContainer = document.createElement("div");
    workoutContainer.classList.add("workout-details", "mt-2", "mb-4");
    // Determine which workout to display based on template name
    let workoutArray;
    const templateName = clickedElement.getAttribute("data-template");
    if (templateName === "arms") {
        workoutArray = workoutData.Workout1;
    } else if (templateName === "back") {
        workoutArray = workoutData.Workout2;
    } else if (templateName === "chest") {
        workoutArray = workoutData.Workout3;
    } else if (templateName === "core") {
        workoutArray = workoutData.Workout4;
    } else if (templateName === "glutes") {
        workoutArray = workoutData.Workout5;
    } else if (templateName === "legs") {
        workoutArray = workoutData.Workout6;
    } else if (templateName === "shoulders") {
        workoutArray = workoutData.Workout7;
    } else {
        console.error("Unknown workout template:", templateName);
        return;
    }
    // Populate workout container with exercises
    workoutArray.forEach((exercise) => {
        const exerciseContainer = document.createElement("div");
        exerciseContainer.classList.add("exercise-container");

        const exerciseName = document.createElement("h5");
        exerciseName.textContent = exercise.exercise;
        exerciseContainer.appendChild(exerciseName);

        const exerciseDetails = document.createElement("p");
        exerciseDetails.innerHTML = `<strong>Sets:</strong> ${exercise.sets} <br> <strong>Rest:</strong> ${exercise.rest}`;
        exerciseContainer.appendChild(exerciseDetails);

        workoutContainer.appendChild(exerciseContainer);
    });
    clickedElement.after(workoutContainer);
}

// Add event listeners to each template link
document.addEventListener("DOMContentLoaded", () => {
    const templateLinks = document.querySelectorAll("#workout-templates a");

    templateLinks.forEach(link => {
        link.addEventListener("click", async (event) => {
            event.preventDefault();
            event.stopPropagation();
            // 'Off' toggle
            const visibleWorkout = link.nextElementSibling;
            if (visibleWorkout && visibleWorkout.classList.contains("workout-details")) {
                visibleWorkout.remove();
                return;
            } 
            // "On" toggle
            const templateName = link.getAttribute("data-template");
            const workoutData = await getWorkoutData(templateName);
            if (workoutData) {
                displayWorkout(workoutData, link);
            }
        })
    });
});


/*
// Fetch and display workout templates to user
const fetchTemplates = async () => {
    const templatesCollection = collection(db, "templates");
    const templateSnapshot = await getDocs(templatesCollection);
    // Map each docuement ID to 'bodyPart' property
    const templatesList = templateSnapshot.docs.map(doc => ({
        bodyPart: doc.id
    }));
    return templatesList;
};

const displayTemplates = async () => {
    const templates = await fetchTemplates();
    const templateContainer = document.getElementById("template-container");

    templates.forEach(template => {
        const templateElement = document.createElement("div");
        templateElement.textContent = template.bodyPart;

        const selectButton = document.createElement("button");
        selectButton.id = "template-button";
        selectButton.textContent = "Add to Agenda";
        selectButton.addEventListener("click", () => addTemplateToAgenda(template));

        templateElement.appendChild(selectButton);
        templateContainer.appendChild(templateElement);
    });
};

// Add selected template to user agenda
const addTemplateToAgenda = async (template) => {
    if (!authorize.currentUser) {
        console.error("User not logged in");
        return;
    }
    // Assign uid to userID variable
    const userID = authorize.currentUser.uid;
    const agendaRef = doc(db, "users", userID, "agenda", "default");

    try {
        await updateDoc(agendaRef, {
            workouts: arrayUnion({
                bodyPart: template.bodyPart,
                addedAt: new Date()
            })
        });
        console.log("Template added to agenda successfully");
    } catch (error) {
        console.error("Error adding template to agenda:", error);
    }
};

document.addEventListener("DOMContentLoaded", displayTemplates);
*/