import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  
} from "https://www.gstatic.com/firebasejs/9.9.1/firebase-auth.js";

const auth = getAuth();

onAuthStateChanged(auth, (user) => {
  if (user != null) {
    console.log("logged in!");
    /* location.href = "home.html"; */
  } else {
    console.log("No user!");
  }
});

document.getElementById("btn-signin").addEventListener("click", () => {
  console.log("try creat user!");
  const email = document.getElementById("email-signin");
  const password = document.getElementById("pass-signin");

  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      location.href = "home.html";
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("Fail: " + errorMessage);
    });
});

document.getElementById("btn-signup").addEventListener("click", () => {
  console.log("try creat user!");

  const name = document.getElementById("name-signup");
  const ocupacao = document.getElementById("ocupacao-signup");
  const phone = document.getElementById("phone-signup");
  const email = document.getElementById("email-signup");
  const password = document.getElementById("pass-signup");
  const pass_confir = document.getElementById("pass-confir-signup");

  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("Sucess: " + user.email);
      location.href = "home.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("Fail: " + errorMessage);
    });
});
