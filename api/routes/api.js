var express = require("express");
var fs = require("fs")
var { isInternetAvailable } = require("is-internet-available")
const wifi = require('node-wifi');

wifi.init({
    iface: null
  });

var router = express.Router();
//internet
router.get("/internet", function(req, res) {
    isInternetAvailable().then((internet) => {
        //let interface = execSync("ip route get 8.8.8.8 | grep -Po 'dev \\K\\w+'")
        res.send({ available: internet/*, interface: interface */})
    }).catch((err) => console.error(err))
})
//wifi
router.get("/scanwifi", function(req, res) {
    wifi.scan((error, networks) => {
        if (error) {
          console.log(error);
          res.send([])
        } else {
          res.send(networks);
        }
      });
})

router.put("/connectwifi", function(req, res) {
  console.log(req.body)
  wifi.connect({ ssid: req.body.ssid, password: req.body.password }, () => {
      res.send({status: "ok"}); 
    });
})

router.get("/checkwifi", function(req, res) {
  wifi.getCurrentConnections((error, networks) => {
      if (error) {
        console.log(error);
        res.send([])
      } else {
        res.send(networks);
      }
    });
})
//config, source, time
router.get("/read", function(req, res) {
    res.send(JSON.parse(fs.readFileSync(`../data/config.json`)));
});

router.put("/update", function(req, res) {
    fs.writeFileSync(`../data/config.json`, JSON.stringify(req.body.data))
    res.send({status: "ok"})
});

module.exports = router;