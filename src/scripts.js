import { db, authorize } from "./firebase-config";
import { collection, getDocs, doc, updateDoc, arrayUnion } from "firebase/firestore";

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
        selectButton.textContent = "Add to Planner";
        selectButton.addEventListener("click", () => addTemplateToPlanner(template));

        templateElement.appendChild(selectButton);
        templateContainer.appendChild(templateElement);
    });
};

// Add selected template to user planner
const addTemplateToPlanner = async (template) => {
    const userID = authorize.currentUser.uid;
    const plannerRef = doc(db, "users", userID, "planner", "default");

    try {
        await updateDoc(plannerRef, {
            workouts: arrayUnion({
                bodyPart: template.bodyPart,
                addedAt: new Date()
            })
        });
        console.log("Template added to planner successfully");
    } catch (error) {
        console.error("Error adding template to planner:", error);
    }
};

document.addEventListener("DOMContentLoaded", displayTemplates);