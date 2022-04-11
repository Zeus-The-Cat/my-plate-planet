import { initializeApp } from "firebase/app"
import { getFirestore } from 'firebase/firestore'
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDh0l-8-qaGGwvchkX2l6T6xLNyMrqgzgQ",
  authDomain: "sustainable-diet-app.firebaseapp.com",
  projectId: "sustainable-diet-app",
  storageBucket: "sustainable-diet-app.appspot.com",
  messagingSenderId: "1086011854097",
  appId: "1:1086011854097:web:af35ef085362871efe10b0",
  measurementId: "G-TLTMRRRKRV"
};


// Initialize Firebase
// export const analytics = getAnalytics(app);
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);