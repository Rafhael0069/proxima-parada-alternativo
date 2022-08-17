import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  getDoc,
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
    getRides(user.uid);
  }
});

//modalLoading.show();

async function getRides(user_uid) {
  //console.log("User dentro da função: " + user_uid);

  const ridesRef = collection(db, "rides");

  const ridesQuery = query(
    ridesRef,
    where("user_uid", "==", user_uid),
    orderBy("date_origin")
  );

  const querySnapshot = await getDocs(ridesQuery);
  querySnapshot.forEach((doc) => {
    //console.log(doc.id, " => ", doc.data());
    showRideData(doc.data(), doc.id);
  });
  modalLoading.hide();
}

function showRideData(rideData, rideId) {
  let banckground_color,
    ride_state,
    disabled = "";
  if (rideData.available == "true") {
    banckground_color = "available";
    ride_state = "Disponivel";
  } else {
    banckground_color = "unavailable";
    ride_state = "Indisponivel";
    disabled = "disabled";
  }

  //console.log(rideId);

  let ridesView = document.getElementById("display-cardviews-rides").innerHTML;
  ridesView =
    ridesView +
    `<div class="card">
      <div class="card-header">
          <p><span>${rideData.user_name}</span> - <span>${rideData.user_occupation}</span></p>
      </div>
      <div class="card-body">
          <div class="card-text">
              <h3>Origen</h3>
              <p>Bairro: <span>${rideData.neighborhood_origin}</span></p>
              <p>Rua: <span>${rideData.street_origin}</span> n°: <span>${rideData.number_origin}</span></p>
              <p><span>${rideData.date_origin}</span> - <span>${rideData.time_origin}</span></p>
          </div>
          <div class="card-text">
              <h3>Destino</h3>
              <p>Bairro: <span>${rideData.neighborhood_destination}</span></p>
              <p>Rua: <span>${rideData.street_destination}</span> n°: <span>${rideData.number_destination}</span></p>
          </div>
          <div class="card-text">
              <p>Veículo: <span>${rideData.vehicle}</span></p>
          </div>
      </div>
      <div class="card-body card-buttons">
          <span class="${banckground_color}">Estatos da carona: ${ride_state}</span>
          <button class="btn-cancel card-button btn btn-outline-danger" ${disabled} 
          data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="idRide(${rideId})" >Encerrar carona</button>
      </div>
    </div>`;

  document.getElementById("display-cardviews-rides").innerHTML = ridesView;
}

export function idRide(idRide){
  console.log("funcionou: "+ idRide);
}
