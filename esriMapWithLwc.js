import { LightningElement, api, track, wire} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import leaflet from '@salesforce/resourceUrl/Leaflet';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';
import { OmniscriptBaseMixin } from 'vlocity_ins/omniscriptBaseMixin';
import mapController from '@salesforce/apex/EsriMapController.getLocations';

export default class EsriMapWithLwc extends OmniscriptBaseMixin(LightningElement) {

@track map;
@track visitList;
@wire(mapController) locationView({ data, error }) {

this.visitList = data;
if (data) {
this.visitList = data;

var values = JSON.parse(this.visitList);
console.log('Location is '+ this.visitList);

var newCustomIcon = new L.icon({
iconUrl: 'https://csa-lpi-2021--csalpi--c.visualforce.com/resource/1647337140000/map_icon1',
iconSize: [30, 45], iconAnchor: [22.5, 100], popupAnchor: [0, -75],
shadowUrl: null, shadowSize: [41, 35], shadowAnchor: [0, 35]
});

var newCustomIcon2 = new L.icon({
iconUrl: 'https://csa-lpi-2021--csalpi--c.visualforce.com/resource/1647355223000/map_icon2?',
iconSize: [30, 45], iconAnchor: [22.5, 100], popupAnchor: [0, -75],
shadowUrl: null, shadowSize: [41, 35], shadowAnchor: [0, 35]
});

var newCustomIcon3 = new L.icon({
iconUrl: 'https://csa-lpi-2021--csalpi--c.visualforce.com/resource/1647355847000/map_icon3?',
iconSize: [30, 45], iconAnchor: [22.5, 100], popupAnchor: [0, -75],
shadowUrl: null, shadowSize: [41, 35], shadowAnchor: [0, 35]
});


for (var i = 0; i < values.locations.length; i++) {
// For Construction Permit
if(values.locations[i].permits.applicationType != null && values.locations[i].permits.applicationType == 'Construction Permit')
{ 
    var recordUrl = "https://csa-lpi-2021--csalpi.lightning.force.com/lightning/r/IndividualApplication/"+ values.locations[i].permits.id +"/view"
    var marker = new L.marker([values.locations[i].latitude, values.locations[i].longitude], {icon: newCustomIcon})
    .bindPopup(values.locations[i].name +'<br><a href='+ recordUrl +'><b>Visit Record</b></a>', {maxWidth : 150 , maxHeight : 100})
    .addTo(this.map);
}
//For Fire Permit
if(values.locations[i].permits.applicationType != null && values.locations[i].permits.applicationType == 'Fire Permit')
{ 
    var recordUrl = "https://csa-lpi-2021--csalpi.lightning.force.com/lightning/r/IndividualApplication/"+ values.locations[i].permits.id +"/view"
    var marker = new L.marker([values.locations[i].latitude, values.locations[i].longitude], {icon: newCustomIcon3})
    .bindPopup(values.locations[i].name +'<br><a href='+ recordUrl +'><b>Visit Record</b></a>', {maxWidth : 150 , maxHeight : 100})
    .addTo(this.map);
}
//For Plumbing permit
if(values.locations[i].permits.applicationType != null && values.locations[i].permits.applicationType == 'Plumbing Permit')
{ 
    var recordUrl = "https://csa-lpi-2021--csalpi.lightning.force.com/lightning/r/IndividualApplication/"+ values.locations[i].permits.id +"/view"
    var marker = new L.marker([values.locations[i].latitude, values.locations[i].longitude])
    .bindPopup(values.locations[i].name +'<br><a href='+ recordUrl +'><b>Visit Record</b></a>', {maxWidth : 150 , maxHeight : 100})
    .addTo(this.map);
}
//For Fence Permit
if(values.locations[i].permits.applicationType != null && values.locations[i].permits.applicationType == 'Fence Permit')
{ 
    var recordUrl = "https://csa-lpi-2021--csalpi.lightning.force.com/lightning/r/IndividualApplication/"+ values.locations[i].permits.id +"/view"
    var marker = new L.marker([values.locations[i].latitude, values.locations[i].longitude], {icon: newCustomIcon2})
    .bindPopup(values.locations[i].name +'<br><a href='+ recordUrl +'><b>Visit Record</b></a>', {maxWidth : 150 , maxHeight : 100})
    .addTo(this.map);
}
}

} else if (error) {

console.log(error);
}
}

leafletInitialized = false;
renderedCallback() {
if(this.leafletInitialized)
{
return;
}
this.leafletInitialized = true;
console.log('rendered-callback');

Promise.all([
loadScript(this, leaflet + '/leaflet.js'),
loadStyle(this, leaflet + '/leaflet.css')
])
.then(() => {
this.initializeLeafLet();
})
.catch(error => {
this.dispatchEvent(
new ShowToastEvent({
title: 'Error loading leaflet library',
message: error.message,
variant: 'error'
})
);
});
}

initializeLeafLet()
{
console.log('initialize leaflet');
const mapEl = this.template.querySelector('.map-root')
mapEl.style = 'height: ' + this.height + ';'

this.map = L.map(mapEl, { zoomControl: true })
.setView([43.651070, -79.347015], 8) // Default Viewvar map = L.map('map').setView([11.206051, 122.447886], 8);
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
{
attribution: 'JL'
}).addTo(this.map)


// var circle = L.circle([51.508, -0.11], {
// color: 'red',
// fillColor: '#f03',
// fillOpacity: 0.5,
// radius: 500
// }).addTo(this.map);

                                        // Will show Longtitude and latitude on PopUP.
// function onMapClick(e) {
//     alert("You clicked the map at " + e.latlng);
// }

// this.map.on('click', onMapClick);

}
}