// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth,  onAuthStateChanged} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyALeInd1ulAmGfKLpA78P-RFlh86XruEys",
  authDomain: "toduolist-b0ee4.firebaseapp.com",
  projectId: "toduolist-b0ee4",
  storageBucket: "toduolist-b0ee4.appspot.com",
  messagingSenderId: "154228128630",
  appId: "1:154228128630:web:d40a128c35912b8a545857",
  measurementId: "G-PJF5424KEK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
const db = getFirestore(app);
var firebase = require('firebase');
var firebaseui = require('firebaseui');

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());

ui.start('#firebaseui-auth-container', {
  signInOptions: [
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
    }
  ]
});


// Is there an email link sign-in?
if (ui.isPendingRedirect()) {
    ui.start('#firebaseui-auth-container', uiConfig);
}


//Detect auth state
onAuthStateChanged(auth, user => {
    if(user != null) {
        console.log('logged in');
    } else{
        console.log('No user');
    }
})