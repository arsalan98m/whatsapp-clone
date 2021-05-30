import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBA9OuOc_HUfmb67OQ2_Zv0zyeUeOonhAE",
  authDomain: "whatsapp-clone-49ffa.firebaseapp.com",
  projectId: "whatsapp-clone-49ffa",
  storageBucket: "whatsapp-clone-49ffa.appspot.com",
  messagingSenderId: "773285756281",
  appId: "1:773285756281:web:24b7e1ef255930a7a3c3a8",
  measurementId: "G-4X1GKB3254",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };

export default db;
