// Checks for URLs changes
function checkUrlChange() {
  let currentUrl = window.location.href;
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(today.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

  //** INSERT APP ADDRESS INSIDE FIELD */
  if (currentUrl.startsWith("INSERT_HERE_APP_ADDRESS")) {

    const textForm = document.querySelectorAll(".form-text")[1];
    const nipInput = document.getElementById("identity_number");

    let btn = document.createElement("button");
    btn.innerHTML = "Search";
    btn.type = "button";
    btn.style.marginLeft = "5px";
    btn.onclick = function () {

      const apiUrl = `https://wl-api.mf.gov.pl/api/search/nip/${nipInput.value}?date=${formattedDate}`;

      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          if (data.code) {
            alert(data.message);
          }

          getAdress(data);

        })
        .catch(error => {
          alert("Error:", error);
        });
    };

    textForm.appendChild(btn);
  }
}

function getAdress(data) {

  const name = data.result.subject.name;
  const workingAddress = data.result.subject.workingAddress;
  const residenceAddress = data.result.subject.residenceAddress;
  const address = residenceAddress ? residenceAddress : workingAddress;
  const regex = /^(.*?)(\d+(?:\/\d+)?(?:\s+lok\s+\d+)?|\d+-\d+)\s*,\s*(\d{2}-\d{3})\s+(.+)$/;

  const matches = address.match(regex);
  if (matches) {
    const street = matches[1].trim();
    const buildingApartment = matches[2];
    const cityCode = matches[3];
    const city = matches[4];

    // Separate building  / apartments numbers.
    const buildingApartmentParts = buildingApartment.split(/\s+lok\s+/i);
    const buildingNumber = buildingApartmentParts[0];
    const apartmentNumber = buildingApartmentParts[1] || '';

    splitedAddress = {
      'name': name,
      'street': street,
      'cityCode': cityCode,
      'city': city,
      'buildingNumber': buildingNumber,
      'apartmentNumber': apartmentNumber,
    }

    insertAddressIntoInputs(splitedAddress);

  } else {
    console.log('Unable to split address.');
  }

}

function insertAddressIntoInputs(address) {
  const name = document.getElementById("name");
  const city = document.getElementById("city");
  const postal_code = document.getElementById("postal_code");
  const street = document.getElementById("street");
  const building_number = document.getElementById("building_number");
  const apartment_number = document.getElementById("apartment_number");

  name.value = address.name;
  city.value = address.city;
  postal_code.value = address.cityCode;
  street.value = address.street;
  building_number.value = address.buildingNumber;
  apartment_number.value = address.apartmentNumber;

}

checkUrlChange();
window.addEventListener("popstate", checkUrlChange);