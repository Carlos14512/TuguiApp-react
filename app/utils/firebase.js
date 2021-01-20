import firebase from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyCAWBZwy9WzaXTQF0jQFSw0S76oCZ7mb4A",
    authDomain: "tenedore-bbce4.firebaseapp.com",
    databaseURL: "https://tenedore-bbce4.firebaseio.com",
    projectId: "tenedore-bbce4",
    storageBucket: "tenedore-bbce4.appspot.com",
    messagingSenderId: "597061078149",
    appId: "1:597061078149:web:f8f872a48acf0d1faa6dec"
};


 

export const firebaseApp = firebase.initializeApp(firebaseConfig);

