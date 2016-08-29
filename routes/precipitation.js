var express = require('express');
var router = express.Router();
var axios = require('axios');

/* GET users listing. */

router.get('/main', function(request,response,iso2Code){
  axios.get("http://api.worldbank.org/countries/" +iso2Code + "/indicators/AG.LND.PRCP.MM?format=json&")

    .then(function (res) {
    console.log(res.data);
    response.json(res.data)
    })
    .catch(function (error) {
      console.log(error);
    });
})
module.exports = router;
