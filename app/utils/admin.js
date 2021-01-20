const  admin = require("firebase-admin");

const serviceAccount = require("./firebase-Key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://tenedore-bbce4.firebaseio.com"
});

export const firestore = admin.firestore()