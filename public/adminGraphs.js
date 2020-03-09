let datasA = [];
let datasB = [];
let datasE = [];
let datasC = [];
let datasD = [];
let datasF = [];
$.ajax({
  url: '/admin/apiType',
  dataType: 'json',
  success: function(data) {
   datasA.push(data);
  }
});

$.ajax({
  url: '/admin/apiUsers',
  dataType: 'json',
  success: function(data) {
   datasB.push(data);
  }
});

$.ajax({
  url: '/admin/apiMonth',
  dataType: 'json',
  success: function(data) {
   datasE.push(data);
  }
});

$.ajax({
  url: '/admin/apiHours',
  dataType: 'json',
  success: function(data) {
   datasC.push(data);
  }
});

$.ajax({
  url: '/admin/apiDay',
  dataType: 'json',
  success: function(data) {
   datasD.push(data);
  }
});

$.ajax({
  url: '/admin/apiYear',
  dataType: 'json',
  success: function(data) {
   datasF.push(data);
  }
});



function createGraphA()
{
	 $(document).ajaxStop(function () {
    
    var ctx = document.getElementById('ChartA').getContext('2d');
    var myChart = new Chart(ctx, datasA[0]);
});
};

function createGraphB()
{
	 $(document).ajaxStop(function () {
    
    var ctx = document.getElementById('ChartB').getContext('2d');
    var myChart = new Chart(ctx, datasB[0]);
});
};

function createGraphC()
{
	 $(document).ajaxStop(function () {
    
    var ctx = document.getElementById('ChartC').getContext('2d');
    var myChart = new Chart(ctx, datasC[0]);
});
};

function createGraphE()
{
	 $(document).ajaxStop(function () {
    
    var ctx = document.getElementById('ChartE').getContext('2d');
    var myChart = new Chart(ctx, datasE[0]);
});
};

function createGraphD()
{
	 $(document).ajaxStop(function () {
    
    var ctx = document.getElementById('ChartD').getContext('2d');
    var myChart = new Chart(ctx, datasD[0]);
});
};

function createGraphF()
{
	 $(document).ajaxStop(function () {
    
    var ctx = document.getElementById('ChartF').getContext('2d');
    var myChart = new Chart(ctx, datasF[0]);
});
};