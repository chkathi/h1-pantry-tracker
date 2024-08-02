// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getFirebase, getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyArEGCyuXkfEIDv6ng1xXd98Vzg8iL3uxw',
  authDomain: 'inventory-management-c4b81.firebaseapp.com',
  projectId: 'inventory-management-c4b81',
  storageBucket: 'inventory-management-c4b81.appspot.com',
  messagingSenderId: '244628767121',
  appId: '1:244628767121:web:80b396533f707bb64f5a30',
  measurementId: 'G-S6S46LF4TL',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const firestore = getFirestore(app)

// Allows you to access firesbase files
export { firestore }

/*
Collections in firebase are the equivalent of databases




*/
