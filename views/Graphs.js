let datas = [];

$.ajax({
  url: '/user/api/graphA',
  dataType: 'json',
  success: function(data) {
   datas.push(data);
  }
});

function createGraphA()
{
    var ctx = document.getElementById('ChartA').getContext('2d');
    var myChart = new Chart(ctx, datas);
}