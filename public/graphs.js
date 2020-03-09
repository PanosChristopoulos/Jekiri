let datasA = [];
let datasAd = [];
let datasBic = [];
let datasRun = [];
let datasFoot = [];
let datasStill = [];
let datasStill2 = [];
let datasRun2 = [];
let datasFoot2 = [];
let datasBic2 = [];
let datasBd = [];
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
  success: function(data2) {
   datasAd.push(data2);
  }
});

$.ajax({
  url: '/user/api/bicyclegraphAd',
  dataType: 'json',
  success: function(data) {
   datasBic.push(data);
  }
});

$.ajax({
  url: '/user/api/runninggraphAd',
  dataType: 'json',
  success: function(data) {
   datasRun.push(data);
  }
});

$.ajax({
  url: '/user/api/footgraphAd',
  dataType: 'json',
  success: function(data) {
   datasFoot.push(data);
  }
});

$.ajax({
  url: '/user/api/stillgraphAd',
  dataType: 'json',
  success: function(data) {
   datasStill.push(data);
  }
});
$.ajax({
  url: '/user/api/stillgraphBd',
  dataType: 'json',
  success: function(data) {
   datasStill2.push(data);
  }
});

$.ajax({
  url: '/user/api/runninggraphBd',
  dataType: 'json',
  success: function(data) {
   datasRun2.push(data);
  }
});
$.ajax({
  url: '/user/api/footgraphBd',
  dataType: 'json',
  success: function(data) {
   datasFoot2.push(data);
  }
});

$.ajax({
  url: '/user/api/bicgraphBd',
  dataType: 'json',
  success: function(data) {
   datasBic2.push(data);
  }
});

$.ajax({
  url: '/user/api/cargraphBd',
  dataType: 'json',
  success: function(data2) {
   datasBd.push(data2);
  }
});

function createGraphCarB()
{
  $(document).ajaxStop(function () {
    var ctx = document.getElementById('cargraphBd').getContext('2d');
   var myChart2 = new Chart(ctx, datasBd[0]);
 });
}

function createGraphBicB()
{
  $(document).ajaxStop(function () {
    var ctx = document.getElementById('bicyclegraphBd').getContext('2d');
   var myChart2 = new Chart(ctx, datasBic2[0]);
 });
}

function createGraphFootB()
{
  $(document).ajaxStop(function () {
    var ctx = document.getElementById('footgraphBd').getContext('2d');
   var myChart2 = new Chart(ctx, datasFoot2[0]);
 });
}


function createGraphRunningB()
{
  $(document).ajaxStop(function () {
    var ctx = document.getElementById('runninggraphBd').getContext('2d');
   var myChart2 = new Chart(ctx, datasRun2[0]);
 });
}

function createGraphStillB()
{
  $(document).ajaxStop(function () {
    var ctx = document.getElementById('stillgraphBd').getContext('2d');
   var myChart2 = new Chart(ctx, datasStill2[0]);
 });
}

function createGraphStill()
{
  $(document).ajaxStop(function () {
    var ctx = document.getElementById('stillgraphAd').getContext('2d');
   var myChart2 = new Chart(ctx, datasStill[0]);
 });
}

function createGraphFoot()
{
  $(document).ajaxStop(function () {
    var ctx = document.getElementById('footgraphAd').getContext('2d');
   var myChart2 = new Chart(ctx, datasFoot[0]);
 });
}

function createGraphRun()
{
  $(document).ajaxStop(function () {
   var ctx = document.getElementById('runninggraphAd').getContext('2d');
   var myChart2 = new Chart(ctx, datasRun[0]);
 });
}

function createGraphBic()
{
  $(document).ajaxStop(function () {
   var ctx = document.getElementById('bicyclegraphAd').getContext('2d');
   var myChart2 = new Chart(ctx, datasBic[0]);
 });
}

function createGraphAd()
{
  $(document).ajaxStop(function () {
	 var ctx2= document.getElementById('cargraphAd').getContext('2d');
	 var myChart2 = new Chart(ctx2, datasAd[0]);
  });
}

function createGraphA()
{
  $(document).ajaxStop(function () {
    var ctx = document.getElementById('ChartA').getContext('2d');
    var myChart = new Chart(ctx, datasA[0]);
  });
}