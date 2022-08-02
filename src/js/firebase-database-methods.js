import {
  getFirestore,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.9.1/firebase-firestore.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-auth.js";

const db = getFirestore();
const auth = getAuth();

const modalLoading = new bootstrap.Modal(
  document.getElementById("modal-loading-login"),
  {}
);

modalLoading.show();

const querySnapshot = await getDocs(collection(db, "users"));
querySnapshot.forEach((doc) => {
  console.log(doc.id, " => ", doc.data());
  displayingUserData(doc.data());
});

function displayingUserData(snapshot) {
  document.getElementById("image-profile").src = snapshot.image_address;
  document.getElementById("name-profile").value = snapshot.name;
  document.getElementById("occupation-profile").value = snapshot.occupation;
  document.getElementById("phone-profile").value = snapshot.phone;
  document.getElementById("email-profile").value = snapshot.email;
  modalLoading.hide();
}

document.getElementById("change-image").onclick = function (e) {
  let input = document.createElement("input");
  input.type = "file";
  input.onchange = (e) => {
    let files = e.target.files;
    let reader = new FileReader();
    reader.onload = function () {
      document.getElementById("image-profile").src = reader.result;
    };
    reader.readAsDataURL(files[0]);
  };
  input.click();
};
