const addressForm = document.querySelector("#address-form");
const cepInput = document.querySelector("#cep");
const addressInput = document.querySelector("#address");
const cityInput = document.querySelector("#city");
const neighborhoodInput = document.querySelector("#neighborhood");
const regionInput = document.querySelector("#region");
const formInputs = document.querySelectorAll("[data-input]");

const closeButton = document.querySelector("#close-message");

const fadeElement = document.querySelector("#fade");


// Validate CEP Input
cepInput.addEventListener("keypress", (e) => {
  const onlyNumbers = /[0-9]|\./;
  const key = String.fromCharCode(e.keyCode);

  console.log(key);

  console.log(onlyNumbers.test(key));

  // allow only numbers
  if (!onlyNumbers.test(key)) {
    e.preventDefault();
    return;
  }
});

// Get address event
cepInput.addEventListener("keyup", (e) => {
    const inputValue = e.target.value;

    // Check if we have the correct length 
    if (inputValue.length === 8  ) {
        getAddress(inputValue);
    }
});

// Get customer address from API
const getAddress = async (cep) => {
    toggleLoader();

    cepInput.blur();

    const apiUrl = `https://viacep.com.br/ws/${cep}/json/`;

    const response = await fetch(apiUrl);

    const data = await response.json();

    // Receber erro
    if(data.erro === "true") {
        if (!addressInput.hasAttribute("disabled")) {
            enableInputs();
        }

        addressForm.reset();
        toggleLoader();
        toggleMessage("CEP inválido!");
        return;
    }

    enableInputs();

    addressInput.value = data.logradouro;
    cityInput.value = data.localidade;
    neighborhoodInput.value = data.bairro;
    regionInput.value = data.uf;

    toggleLoader();
};

// Add or remove disable attribute
const toggleDisabled = () => {
    if (regionInput.hasAttribute("disabled")) {
      formInputs.forEach((input) => {
        input.removeAttribute("disabled");
      });
    } else {
      formInputs.forEach((input) => {
        input.setAttribute("disabled", "disabled");
      });
    }
  };

  // Enable the form inputs
const enableInputs = () => {
    formInputs.forEach((input) => {
        input.removeAttribute("disabled");
    });
};
  


//Loader 
const toggleLoader = () => {
    const loaderElement = document.querySelector("#loader");

    fadeElement.classList.toggle("hide");
    loaderElement.classList.toggle("hide");
};

//Show or hide message 
const toggleMessage = (msg) => {
    
    const messageElement = document.querySelector("#message");

    const messageElementText = document.querySelector("#message p");

    messageElementText.innerText = msg;

    fadeElement.classList.toggle("hide");
    messageElement.classList.toggle("hide");
};

//Fechar caixa de msg:
closeButton.addEventListener("click", () => toggleMessage());

// Save address
addressForm.addEventListener("submit", (e) => {
    e.preventDefault();
  
    toggleLoader();
  
    setTimeout(() => {
      toggleLoader();
  
      toggleMessage("Endereço salvo com sucesso!");
  
      addressForm.reset();
  
      toggleDisabled();
    }, 1000);
  });