import firebase from "firebase/compat/app";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDv3d2Ytwd-28fYPSuQWVheCxqurEG5-wo",
  authDomain: "event-45b86.firebaseapp.com",
  projectId: "event-45b86",
  storageBucket: "event-45b86.appspot.com",
  messagingSenderId: "1010322523289",
  appId: "1:1010322523289:web:aa21ed87deacf03f946408",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };
