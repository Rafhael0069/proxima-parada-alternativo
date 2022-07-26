import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-auth.js";
const auth = getAuth();


document.getElementById("btn-logout").addEventListener("click", () => {
  console.log("Saindo");
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      location.href = "index.html";
    })
    .catch((error) => {
      // An error happened.
      console.log("Fail: " + error);
    });
});
