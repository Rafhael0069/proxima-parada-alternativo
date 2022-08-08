import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.9.1/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.9.1/firebase-auth.js";

const db = getFirestore();
const auth = getAuth();
const modalLoading = new bootstrap.Modal(
  document.getElementById("modal-loading-login"),
  {}
);

modalLoading.show();

onAuthStateChanged(auth, (user) => {
  if (user != null) {
    getRides();
  }
});

//modalLoading.show();

async function getRides() {
  //console.log("User dentro da função: " + user_uid);

  const ridesRef = collection(db, "rides");

  const ridesQuery = query(
    ridesRef,
    where("available", "==", "true"),
    where("date_origin", ">=", dataAtualFormatada()),
    orderBy("date_origin",)
  );

  const querySnapshot = await getDocs(ridesQuery);
  querySnapshot.forEach((doc) => {
    //console.log(doc.id, " => ", doc.data());
    showRideData(doc.data(), doc.id);
  });
  modalLoading.hide();
}

function showRideData(rideDaat, rideId) {
  let ridesView = document.getElementById(
    "display-cardviews-rides-home"
  ).innerHTML;
  ridesView =
    ridesView +
    `<div class="card">
        <div class="card-header">
            <p><span>${rideDaat.user_name}</span> - <span>${rideDaat.user_occupation}</span></p>
        </div>
        <div class="card-body">
            <div class="card-text">
                <h3>Origen</h3>
                <p>Bairro: <span>${rideDaat.neighborhood_origin}</span></p>
                <p>Rua: <span>${rideDaat.street_origin}</span> n°: <span>${rideDaat.number_origin}</span></p>
                <p><span>${rideDaat.date_origin}</span> - <span>${rideDaat.time_origin}</span></p>
            </div>
            <div class="card-text">
                <h3>Destino</h3>
                <p>Bairro: <span>${rideDaat.neighborhood_destination}</span></p>
                <p>Rua: <span>${rideDaat.street_destination}</span> n°: <span>${rideDaat.number_destination}</span></p>
            </div>
            <div class="card-text">
                <p>Veículo: <span>${rideDaat.vehicle}</span></p>
            </div>
        </div>
            <div class="card-body">
                <button class="card-button btn-primary">Conversar com o proprietário</button>
            </div>
      </div>`;

  document.getElementById("display-cardviews-rides-home").innerHTML = ridesView;
}

function dataAtualFormatada() {
  const timeElapsed = Date.now();

  let data = new Date(timeElapsed);
  let dataFormatada = data.toLocaleDateString("pt-BR", { timeZone: "UTC" });
  //console.log(dataFormatada);
  return dataFormatada;
}
