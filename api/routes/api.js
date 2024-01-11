var express = require("express");
var fs = require("fs")
var { isInternetAvailable } = require("is-internet-available")
const wifi = require('node-wifi');
const os = require('os-utils');
var diskspace = require('diskspace');

const gb = (a) => {
  return Math.round((a / 1073741824) * 100) / 100
}

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
        res.send([
          {
              "iface": "Wi-Fi",
              "ssid": "connected",
              "bssid": "",
              "mac": "",
              "mode": "1c:aa:07:17:d5:3f",
              "channel": null,
              "frequency": null,
              "signal_level": null,
              "quality": null,
              "security": "802.11n",
              "security_flags": "WPA2-Enterprise"
          }
      ])
      } else {
        res.send(networks);
      }
    });
})
//cpu, ram, disk usage
router.get("/cpu", function(req, res) {
  os.cpuUsage((val) => {
    res.send({value: Math.round(val * 100)})
  })
})

router.get("/ram", function(req, res) {
    res.send({percent: Math.round(100 - os.freememPercentage() * 100), value: Math.round((((os.totalmem() - os.freemem()) / 1024) + Number.EPSILON) * 100) / 100, total: Math.round((os.totalmem() / 1024) * 100) / 100})
})

router.get("/disk", function(req, res) {
  if (os.platform() === "win32") {
    diskspace.check('C', (err, result) => {
      res.send({total: gb(result.total), used: gb(result.used), free: gb(result.free), percent: Math.round(gb(result.used) / gb(result.total) * 100)})
    });
  } else {
    diskspace.check('/', (err, result) => {
      res.send({total: gb(result.total), used: gb(result.used), free: gb(result.free), percent: Math.round(gb(result.used) / gb(result.total) * 100)})
    });
  }
  
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