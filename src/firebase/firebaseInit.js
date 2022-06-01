import firebase from "firebase/app";
import "firebase/firestore";

var firebaseConfig = {
  apiKey: "AIzaSyD1N7oi8jaODmfVFYWXeBnDJLnervMQOmk",
  authDomain: "invoice-vue-39b9e.firebaseapp.com",
  projectId: "invoice-vue-39b9e",
  storageBucket: "invoice-vue-39b9e.appspot.com",
  messagingSenderId: "302691436240",
  appId: "1:302691436240:web:df6fd364645a47919a00d5",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

export default firebaseApp.firestore();
