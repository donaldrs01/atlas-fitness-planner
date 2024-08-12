/* Webpack will bundle all JS files that are imported into this file */
import { app } from "./firebase-config";
import "./authentication";
import "./scripts";

console.log("Firebase app initialized:", app);