let adminData=[];


 $.ajax({
  url: '/admin/api',
  dataType: 'json',
  timeout: 150000,
  success: function(data) {
   adminData.push(data);
  }
});


$('#filter').submit(function(e){
  e.preventDefault();
  //do some verification
  $.ajax({
     type: 'POST', 
    url: '/admin/api',
    data: $(this).serialize(),
    success: function(data)
    {
      //callback methods go right here
    }
  });
});


  function createMapAdmin(){
    
 $(document).ajaxStop(function () {
    console.log(adminData[0]);
       
    let mymap3= L.map('mapadmin');

let url = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

let osm= new L.TileLayer(url);
  mymap3.addLayer(osm);
  mymap3.setView([38.246242, 21.7350847],16);
  
  let cfg2 = {
  "radius": 40,
  "maxOpacity": 0.8,
  
  "scaleRadius": false,
 
   "useLocalExtrema": false,
 
  latField: 'lat',
 
  lngField: 'lng',
 
  valueField: 'count'
}
let heatmapLayer2 =  new HeatmapOverlay(cfg2);

mymap3.addLayer(heatmapLayer2);
heatmapLayer2.setData(adminData[0]);

});
};
