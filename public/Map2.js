let excludeData = [];

$.ajax({
  type: 'POST',
  url: '/user/upload',
  data: {dedomena:excludeData},
  success: function(data){
    console.log(data);
  }
   
  
});



function createMap2(){



let mymap2 = L.map('mapid2');

let url = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

let osm= new L.TileLayer(url);
  mymap2.addLayer(osm);
  mymap2.setView([38.246242, 21.7350847],16);


  var editableLayers = new L.FeatureGroup();
  mymap2.addLayer(editableLayers);

var drawPluginOptions = {
  position: 'topright',
  draw: {
    rectangle: {
      allowIntersection: false, 
      drawError: {
        color: '#e1e100', 
        message: 'Error!' 
      },
      shapeOptions: {
        color: '#97009c'
      }
    },
    
    polyline: false,
    circle: false, 
    polygon: false,
    marker: false,
    },
  edit: {
    featureGroup: editableLayers, 
    remove: true
  }
};
var drawControl = new L.Control.Draw(drawPluginOptions);
mymap2.addControl(drawControl);


mymap2.on('draw:created', function(e) {
  var type = e.layerType,
    layer = e.layer;
  editableLayers.addLayer(layer);
  if (type === 'rectangle') {
        var points = layer.getLatLngs();
        var delData = points[0];
        var arraylength = delData.length;
        
          excludeData.push(delData);

        

          console.log(excludeData);
         // console.log(excludeData);
        
   }



});
}