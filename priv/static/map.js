let myMap = L.map('mapid').setView([51.505, -0.09], 4);
let OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

fetch("tournaments").then((resp) => {
    resp.json().then((parsed_tourneys) => {
        let tourney_markers = parsed_tourneys.map((tourney) => {
            let { lat, lng } = tourney["location"];
            return L.marker().setLatLng([lat, lng]).bindPopup(`<a href=${tourney["url"]}>${tourney["name"]}</a>`);
        });
        L.layerGroup(tourney_markers).addTo(myMap);
    })
});

// Sets loader and overlay while user responds to loacation prompt.
let overlay = document.createElement("div");
let loader = document.createElement("div");
overlay.className = "overlay";
loader.className = "loader";

let mapContaner = document.getElementById('map-container');
mapContaner.appendChild(overlay);
mapContaner.appendChild(loader);

// Set position based on user location, if they grant it.
// Removes overlay and loader during success or failure.
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setPositition, showError)
    }
    else {
        alert("Please unable the browser to know your location or Geolocation is not supported by this browser.");
    }
}

function setPositition(resp) {
    myMap.setView([resp.coords.latitude, resp.coords.longitude], 10);
    mapContaner.removeChild(overlay);
    mapContaner.removeChild(loader);
}

function showError() {
    console.log("Location denied.");
    mapContaner.removeChild(overlay);
    mapContaner.removeChild(loader);
}

getLocation();
