import {
  getAuth,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.9.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/9.9.1/firebase-firestore.js";
const auth = getAuth();
const db = getFirestore();
const loading = document.querySelector(".loading-image-user");
const image = document.querySelector(".img-user");

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


onAuthStateChanged(auth, (user) => {
  if (user != null) {
    getImageUser(user);
  }
});

async function getImageUser(user) {

  const docRef = doc(db, "users/" + user.uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    image.src = docSnap.data().image_address;
    ofLoad();
  } 

}

function onLoad(){
  loading.classList.remove("display-off");
  image.classList.add("display-off");
}

function ofLoad(){
  loading.classList.add("display-off");
  image.classList.remove("display-off");
}