import {
  getFirestore,
  updateDoc,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/9.9.1/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.9.1/firebase-auth.js";

import {
  uploadBytesResumable,
  getDownloadURL,
  getStorage,
  ref,
} from "https://www.gstatic.com/firebasejs/9.9.1/firebase-storage.js";

const db = getFirestore();
const auth = getAuth();
const storage = getStorage();

let dataUser;
let userUid;

onAuthStateChanged(auth, (user) => {
  if (user != null) {
    userUid = user.uid;
    getDataCurrentUser(userUid);
  }
});

let newImage;
let change_image = false;

let image = document.getElementById("image-profile");
let name = document.getElementById("name-profile");
let occupation = document.getElementById("occupation-profile");
let phone = document.getElementById("phone-profile");
let email = document.getElementById("email-profile");

const modalLoading = new bootstrap.Modal(
  document.getElementById("modal-loading-login"),
  {}
);

modalLoading.show();

async function getDataCurrentUser(userUid) {
  const docRef = doc(db, "users/" + userUid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    displayingUserData(docSnap.data());
    dataUser = docSnap.data();
  } else {
    console.log("Não há tal documento!");
  }
}

function displayingUserData(snapshot) {
  image.src = snapshot.image_address;
  name.value = snapshot.name;
  occupation.value = snapshot.occupation;
  phone.value = snapshot.phone;
  email.value = snapshot.email;
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
      newImage = files[0];
      change_image = true;
    };
    reader.readAsDataURL(files[0]);
  };
  input.click();
};

function testeUploadImage(file) {}

document.getElementById("btn-save-editions").addEventListener("click", () => {
  modalLoading.show();
  if (change_image) {
    modalLoading.show();
    uploadImage(name.value, occupation.value, phone.value);
  } else {
    updateUserData(
      name.value,
      occupation.value,
      phone.value,
      dataUser.image_address
    );
  }
});

function uploadImage(name, occupation, phone) {
  const storageRef = ref(storage, "imageUsers/" + dataUser.user_uid + ".jpg");
  const uploadTask = uploadBytesResumable(storageRef, newImage);
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      /*     const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Upload is " + progress + "% done"); */
    },
    (error) => {
      modalLoading.hide();
    },
    () => {
      // Upload completed successfully, now we can get the download URL
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        image.src = downloadURL;
        change_image = false;
        updateUserData(name, occupation, phone, downloadURL);
      });
    }
  );
}

async function updateUserData(name, occupation, phone, imageUrl) {
  try {
    const userRef = doc(db, "users/" + userUid);
    await updateDoc(userRef, {
      name: name,
      image_address: imageUrl,
      occupation: occupation,
      phone: phone,
    });

    modalLoading.hide();
    location.href = "home.html";
  } catch (e) {
    modalLoading.hide();
    console.error("Erro ao adicionar documento: ", e);
  }
}
