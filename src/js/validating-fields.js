const fields = document.querySelectorAll("[required]");

function ValidateField(field) {
  // logica para verificar se existem erros
  function verifyErrors() {
    let foundError = false;

    for (let error in field.validity) {
      // se não for customError
      // então verifica se tem erro
      if (field.validity[error] && !field.validity.valid) {
        foundError = error;
      }
    }
    return foundError;
  }

  return function () {
    const error = verifyErrors();

    if (error) {
      field.style.borderColor = "red";
    } else {
      field.style.borderColor = "green";
    }
  };
}

function customValidation(event) {
  const field = event.target;
  const validation = ValidateField(field);

  validation();
}

for (let field of fields) {
  field.addEventListener("invalid", (event) => {
    // eliminar telefone bubble
    event.preventDefault();

    customValidation(event);
  });
  field.addEventListener("blur", customValidation);
}

function botaoAcionado(){
  console.log("funcionou");
}
