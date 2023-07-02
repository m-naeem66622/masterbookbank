const { initializeApp } = require("firebase/app");

const firebaseConfig = {
    apiKey: "AIzaSyCRQ-ZSIu3REEAUWR4AYMbcI0963yyqcgQ",
    authDomain: "masterbookbank-da195.firebaseapp.com",
    projectId: "masterbookbank-da195",
    storageBucket: "masterbookbank-da195.appspot.com",
    messagingSenderId: "51792011177",
    appId: "1:51792011177:web:a3efde3be0a88e6af9aeb8",
};

const app = initializeApp(firebaseConfig);

module.exports = app;
