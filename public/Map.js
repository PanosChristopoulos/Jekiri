let testData = [];

let readyData=[];

$.ajax({
  url: '/user/api',
  dataType: 'json',
  success: function(data) {
   testData.push(data);
  }
});







  
  

 function createMap(){  





let mymap = L.map('mapid');



let url = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

let osm= new L.TileLayer(url);
  mymap.addLayer(osm);
  mymap.setView([38.246242, 21.7350847],16);






  let cfg = {
    "radius": 40,
    "maxOpacity": 0.8,
    
    "scaleRadius": false,
  
   "useLocalExtrema": false,
 
  latField: 'lat',
 
  lngField: 'lng',
 
  valueField: 'count'
};
let heatmapLayer =  new HeatmapOverlay(cfg);

mymap.addLayer(heatmapLayer);
heatmapLayer.setData(testData[0]);


}