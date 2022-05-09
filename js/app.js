//VARIABLES

const container = document.querySelector(".container");
const results = document.querySelector("#resultado");
const form = document.querySelector("#formulario");
const searchBtn = document.querySelector("#btn");

//variables for the latitude and longitude


//eventlisteners
window.addEventListener("load", () => form.addEventListener("submit", searchClimate));

//functions
function searchClimate(e) {
    e.preventDefault();

    const city = document.querySelector("#ciudad").value;
    const countrySelect = document.querySelector("#pais").value;

    //validation
    if(city === "" || countrySelect === "") {
        showAlert("Both fields are required!");
        return;
    };

    //consult the geocoder api
    geocoderAPI(city, countrySelect);
    
    // //consult the wether api
    // tempAPI(long, lati);
    
}

function showAlert(message) {
    const alert = document.querySelector(".alert");

    //validation to avoid duplicate alert
    if(!alert) {
        const alert = document.createElement("div");
        alert.classList.add("bg-red-300", "border-red-400", "text-red-800", "px-4", "py-3",
        "rounded", "max-w-md", "mx-auto", "mt-6", "text-center", "alert");

        alert.innerHTML = `
        <strong class="font-bold">ERROR!</strong>
        <span class="block">${message}</span>
        `;

        form.insertBefore(alert, searchBtn);

        //delete alert after 4 sec

        setTimeout( () => alert.remove(), 4000);

    } 
}

function geocoderAPI(city, country) {

    const appKey = "d66c70e6e2371da6a8fecf7d117458c7";
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${city},${country}&appid=${appKey}`;

    fetch(url)
        .then(response => response.json())
        .then(result => {
            const long = result[0].lon;
            const lati = result[0].lat;
            tempAPI(long, lati);
        });
}

function haceralgo(algo) {
    console.log(algo);
}

function tempAPI(long, lati) {
    console.log(long, lati)
    const appKey = "d66c70e6e2371da6a8fecf7d117458c7";
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lati}&lon=${long}&appid=${appKey}`;

    fetch(url)
        .then(response => response.json())
        .then(result => {
            const {main:{temp, temp_max, temp_min}} = result; //here we do deep destructuring
            console.log("La temperatura de Moca es: ", parseInt(temp - 273.15));
        })
}