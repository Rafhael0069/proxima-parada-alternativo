import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.9.1/firebase-auth.js";
import {
  getFirestore,
  addDoc,
  setDoc,
  doc,
  collection,
} from "https://www.gstatic.com/firebasejs/9.9.1/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();

const modalLoading = new bootstrap.Modal(
  document.getElementById("modal-loading-login"),
  {}
);

onAuthStateChanged(auth, (user) => {
  modalLoading.show();
  if (user != null) {
    console.log("logged in!");
    //location.href = "home.html";
    modalLoading.hide();
  } else {
    console.log("No user!");
    modalLoading.hide();

    document.getElementById("email-signin").value = "rafhael@gmail.com";
    document.getElementById("pass-signin").value = "123456";
  }
});

document.getElementById("btn-signin").addEventListener("click", () => {
  modalLoading.show();
  const email = document.getElementById("email-signin");
  const password = document.getElementById("pass-signin");

  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      modalLoading.hide();
      location.href = "home.html";
      // ...
    })
    .catch((error) => {
      console.log("Fail: " + error.message);
      modalLoading.hide();
      if (error.code === "auth/invalid-email") {
        alert("Formato de email inválido.");
      } else if (error.code === "auth/user-disabled") {
        alert("Esse usuário foi desabilitado.");
      } else if (error.code === "auth/user-not-found") {
        alert("Usuário não encontrado.");
      } else if (error.code === "auth/wrong-password") {
        alert("Senha incorreta. digite novamente.");
        this.loginForm.controls.password.setValue(null);
      } else {
        alert(error.message);
      }
    });
});

document.getElementById("btn-signup").addEventListener("click", () => {
  modalLoading.show();
  const name = document.getElementById("name-signup").value;
  const occupation = document.getElementById("occupation-signup").value;
  const phone = document.getElementById("phone-signup").value;
  const email = document.getElementById("email-signup").value;
  const password = document.getElementById("pass-signup").value;
  const pass_confir = document.getElementById("pass-confir-signup").value;

  validatingFields(name, occupation, phone, email, password, pass_confir);
});

function createUser(name, occupation, phone, email, password) {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      writeUserData(name, occupation, phone, email, user);
      console.log("Sucess!"+user.uid);
    })
    .catch((error) => {
      modalLoading.hide();
      if (error.code === "auth/invalid-email") {
        alert("Formato de email inválido.");
      } else if (error.code === "auth/email-already-in-use") {
        alert("Esse email já é utilizado por outro usuário.");
      } else if (error.code === "auth/weak-password") {
        alert("Senha muito fraca.");
        email.setValue(null);
      } else {
        alert(error.message);
      }
    });
}

async function writeUserData(name, occupation, phone, email, user) {
  try {
    await setDoc(doc(db, "users/"+user.uid), {
      email: email,
      image_address:
        "https://firebasestorage.googleapis.com/v0/b/proximaparadaalternativo.appspot.com/o/imageUsers%2Favatar.jpg?alt=media&token=c8121aa1-d4d3-4db8-bb73-56ca627f83eb",
      name: name,
      occupation: occupation,
      phone: phone,
      user_uid: user.uid,
    });
    //console.log("teste!"+user.uid);
    modalLoading.hide();
    location.href = "home.html";
  } catch (e) {
    modalLoading.hide();
    console.error("Erro ao adicionar documento: ", e);
  }
}

function validatingFields(
  name,
  occupation,
  phone,
  email,
  password,
  pass_confir
) {
  if (password != "" && password > 5) {
    if (password == pass_confir) {
      createUser(name, occupation, phone, email, password);
      //console.log("Sucesso");
    } else {
      modalLoading.hide();
      alert("Senhas diferentes.");
    }
  } else {
    modalLoading.hide();
    alert("Senhas muito curta.");
    
  }
}

var phoneNumber;
var valueFun;

/* Máscaras ER */
function mask(phone, fun) {
  phoneNumber = phone;
  valueFun = fun;
  setTimeout(execmascara(), 1);
}

function execmascara() {
  phoneNumber.value = valueFun(phoneNumber.value);
}

function phoneMask(phoNum) {
  phoNum = phoNum.replace(/\D/g, ""); //Remove tudo telefone que não é dígito
  phoNum = phoNum.replace(/^(\d{2})(\d)/g, "($1) $2"); //Coloca parênteses em volta dos dois primeiros dígitos
  phoNum = phoNum.replace(/(\d)(\d{8})/g, "$1 $2"); //Coloca espaço entre 9 e os outros numeros
  phoNum = phoNum.replace(/(\d)(\d{4})$/, "$1-$2"); //Coloca hífen entre telefone quarto e telefone quinto dígitos
  return phoNum;
}

function id(element) {
  return document.getElementById(element);
}

window.onload = function () {
  id("phone-signup").onkeyup = function () {
    mask(this, phoneMask);
  };
};
