let datasA = [];
let datasAd = [];

$.ajax({
  url: '/user/api/graphA',
  dataType: 'json',
  success: function(data) {
   datasA.push(data);
  }
});

$.ajax({
  url: '/user/api/cargraphA',
  dataType: 'json',
  success: function(data) {
   datasAd.push(data);
  }
});

function createGraphAd()
{
	 var ctx = document.getElementById('cargraphAd').getContext('2d');
	 var myChart = new Chart(ctx, datasAd);
}
function createGraphA()
{
    var ctx = document.getElementById('ChartA').getContext('2d');
    var myChart = new Chart(ctx, datasA);
}