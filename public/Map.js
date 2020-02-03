
function createMap(){
let mymap = L.map('mapid');

let url = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

let osm= new L.TileLayer(url);
	mymap.addLayer(osm);
	mymap.setView([38.246242, 21.7350847],16);
}