import { getFirestore } from "firebase/firestore";
import { initializeApp } from 'firebase/app';

// Optionally import the services that you want to use
import { getAuth } from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyALeInd1ulAmGfKLpA78P-RFlh86XruEys",
    authDomain: "toduolist-b0ee4.firebaseapp.com",
    projectId: "toduolist-b0ee4",
    storageBucket: "toduolist-b0ee4.appspot.com",
    messagingSenderId: "154228128630",
    appId: "1:154228128630:web:e67429b7b5873ef0545857",
    measurementId: "G-N8Y5MB5730"
};


export const APP = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const AUTH = getAuth(APP);

// Initialize Cloud Firestore and get a reference to the service
export const DATABASE = getFirestore(APP);


// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
