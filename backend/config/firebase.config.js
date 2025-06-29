const admin = require('firebase-admin');
require('dotenv').config();
const firebaseConfig = require("../cred/serviceKey.js")

console.log("Firebase Connected..")
admin.initializeApp({
    credential : admin.credential.cert(firebaseConfig)
});
