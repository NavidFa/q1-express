var express = require('express');
var router = express.Router();
var axios = require('axios');

/* GET users listing. */

router.get('/', function(request,response){
  axios.get('http://api.worldbank.org/countries/all?format=json&per_page=305')
    .then(function (res) {
    response.json(res.data)
    })
    .catch(function (error) {
      console.log(error);
    });
})
router.get('/pr/:iso2Code', function(request,response){
  var iso2Code = request.params.iso2Code
  axios.get("http://api.worldbank.org/countries/" + iso2Code + "/indicators/AG.LND.PRCP.MM?format=json&")
    .then(function (res) {
    response.json(res.data)
    })
    .catch(function (error) {
      console.log(error);
    });
})
router.get('/live/:iso2Code', function(request,response){
  var iso2Code = request.params.iso2Code
  axios.get("http://api.worldbank.org/countries/" + iso2Code + "/indicators/AG.PRD.LVSK.XD?format=json&")
    .then(function (res) {
    response.json(res.data)
    })
    .catch(function (error) {
      console.log(error);
    });
})
router.get('/food/:iso2Code', function(request,response){
  var iso2Code = request.params.iso2Code
  axios.get("http://api.worldbank.org/countries/" + iso2Code + "/indicators/AG.PRD.FOOD.XD?format=json&")
    .then(function (res) {
    response.json(res.data)
    })
    .catch(function (error) {
      console.log(error);
    });
})
router.get('/gdp/:iso2Code', function(request,response){
  var iso2Code = request.params.iso2Code
  axios.get("http://api.worldbank.org/countries/" + iso2Code + "/indicators/NY.GDP.PCAP.CD?format=json&")
    .then(function (res) {
    response.json(res.data)
    })
    .catch(function (error) {
      console.log(error);
    });
})
module.exports = router;
