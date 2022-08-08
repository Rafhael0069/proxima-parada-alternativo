import {
  getFirestore,
  collection,
  setDoc,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/9.9.1/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.9.1/firebase-auth.js";

const db = getFirestore();
const auth = getAuth();

let userUid;
let currentUser;

onAuthStateChanged(auth, (user) => {
  if (user != null) {
    userUid = user;
    getDataUser(user);
  }
});

async function getDataUser(user) {
  const docRef = doc(db, "users/" + user.uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    currentUser = docSnap.data();
  }
}

const vehicles = document.querySelectorAll('input[name="vehicle"]');
const regularities = document.querySelectorAll('input[name="regularity"]');
const checkDays = document.querySelectorAll('input[name="day"]');

let rideData;

let neighborhoodOrigen = document.getElementById("neighborhood-origin");
let streetOrigin = document.getElementById("street-origin");
let numberOrigin = document.getElementById("number-origin");
let dateOrigin = document.getElementById("date-origin");
let timeOrigin = document.getElementById("time-origin");
let neighborhoodDestination = document.getElementById(
  "neighborhood-destination"
);
let streetDestination = document.getElementById("street-destination");
let numberDestination = document.getElementById("number-destination");

let i_regularity, i_vehicle;
let i_days = [];

const modalLoading = new bootstrap.Modal(
  document.getElementById("modal-loading-login"),
  {}
);

//modalLoading.show();

document.getElementById("btn-register-ride").addEventListener("click", () => {
  modalLoading.show();
  for (const v of vehicles) {
    if (v.checked) {
      i_vehicle = v.value;
      break;
    }
  }

  for (const r of regularities) {
    if (r.checked) {
      i_regularity = r.value;
      break;
    }
  }
  if (i_regularity == "true") {
    checkDays.forEach((day) => {
      if (day.checked) {
        i_days.push(day.value);
      }
    });
  }

  rideData = {
    available: "true",
    user_name: currentUser.name,
    user_uid: currentUser.user_uid,
    user_occupation: currentUser.occupation,
    neighborhood_origin: neighborhoodOrigen.value,
    street_origin: streetOrigin.value,
    number_origin: numberOrigin.value,
    date_origin: dataAtualFormatada(dateOrigin.value),
    time_origin: timeOrigin.value,
    neighborhood_destination: neighborhoodDestination.value,
    street_destination: streetDestination.value,
    number_destination: numberDestination.value,
    vehicle: i_vehicle,
    regularity: i_regularity,
    days: i_days,
  };

  saveData(rideData);

  //console.log(rideData.get());
});

async function saveData(rideData) {
  const timeElapsed = Date.now();
  const dataCompleta = new Date(timeElapsed);
  let rideId = Date.parse(dataCompleta);

  let {
    available,
    user_name,
    user_uid,
    user_occupation,
    neighborhood_origin,
    street_origin,
    number_origin,
    date_origin,
    time_origin,
    neighborhood_destination,
    street_destination,
    number_destination,
    vehicle,
    regularity,
    days,
  } = rideData;

  await setDoc(doc(db, "rides/" + rideId), {
    available,
    date_origin,
    days,
    neighborhood_destination,
    neighborhood_origin,
    number_destination,
    number_origin,
    regularity,
    ride_id: rideId,
    street_destination,
    street_origin,
    time_origin,
    user_name,
    user_occupation,
    user_uid,
    vehicle,
  });
  location.href = "rides.html";
  modalLoading.hide();
}

function dataAtualFormatada(dataO) {
  let data = new Date(dataO);
  let dataFormatada = data.toLocaleDateString("pt-BR", { timeZone: "UTC" });
  return dataFormatada;
}
