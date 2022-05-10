//VARIABLES

const container = document.querySelector(".container");
const results = document.querySelector("#resultado");
const form = document.querySelector("#formulario");
const searchBtn = document.querySelector("#btn");

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
            if(result.length === 0){
                showAlert("We can not find this city, please check and try again!");
                return;
            }
            const long = result[0].lon;
            const lati = result[0].lat;
            tempAPI(long, lati);
        });
}


function tempAPI(long, lati) {
    console.log(long, lati)
    const appKey = "d66c70e6e2371da6a8fecf7d117458c7";
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lati}&lon=${long}&appid=${appKey}`;

    //we call the spinner before fetch, it will dissapear when we gt the data, because the clearhtml function
    spinner();

    fetch(url)
        .then(response => response.json())
        .then(result => {
            showHtml(result);
        })
}

function showHtml(info) {

    const {name, main:{temp, temp_max, temp_min}} = info; //here we do deep destructuring

    //clear previus html
    clearHtml(results);

    //converting kelvin to celsius
    const tempConverted = convertToCelsius(temp);
    const maxConverted = convertToCelsius(temp_max);
    const minConverted = convertToCelsius(temp_min);

    //scripting
    const climateHTML = document.createElement("div");
    const tempHTML = document.createElement("p");
    const tempMinHTML = document.createElement("p");
    const tempMaxHTML = document.createElement("p");

    climateHTML.classList.add("text-center", "text-white")
    tempHTML.classList.add("text-6xl");
    tempHTML.innerHTML = `<span class="font-bold", "text-center">${name}: ${tempConverted}°C</span>`;

    tempMaxHTML.innerHTML = `<span class="font-bold", "text-center">Max: </span>${maxConverted}°C`;
    tempMaxHTML.classList.add("text-xl");
    tempMinHTML.innerHTML = `<span class="font-bold", "text-center">Min: </span>${minConverted}°C`;
    tempMinHTML.classList.add("text-xl");
    

    climateHTML.appendChild(tempHTML);
    climateHTML.appendChild(tempMaxHTML);
    climateHTML.appendChild(tempMinHTML);

    results.appendChild(climateHTML);
}

function convertToCelsius(grade) {
    return parseInt(grade -273.15);
}

function clearHtml(node) {
    while(node.firstChild) {
        node.removeChild(node.firstChild);
    };
}

function spinner() {
    clearHtml(results);
    const divSpinner = document.createElement("div");
    divSpinner.classList.add("sk-chase");

    divSpinner.innerHTML = `
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>
    `;

    results.appendChild(divSpinner);
}