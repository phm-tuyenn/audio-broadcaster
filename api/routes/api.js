var express = require("express");
var fs = require("fs")
var { execSync, exec } = require("child_process")
var path = require("path")

var router = express.Router();

router.get("/usb", function(req, res) {
      res.send(JSON.parse(execSync("./routes/usb.exe",  {'shell':'powershell.exe'}).toString().replace(/'/g,"\"")))
})

router.post("/generate", function(req, res) {
  let config = JSON.parse(fs.readFileSync(path.join(req.body.path, `/config.json`)))
  config.forEach(el => {
    if(el.type === "text") {
      console.log(`gtts \"${el.id}\" -l vi -o \"${path.join(req.body.path, el.dir.toString(), "0.mp3")}\"`)
      execSync(`gtts \"${el.id}\" -l vi -o \"${path.join(req.body.path, el.dir.toString(), "0.mp3")}\"`)
    }
  }); 
  console.log("ok") 
  res.send({"status":"ok"})
})

router.post("/explorer", function(req, res) {
  exec(`explorer ${path.join(req.body.path, req.body.id.toString())}`)
  res.send({"status": "ok"})
})

//config, source, time
router.post("/read", function(req, res) {
    console.log(req.body.path)
    res.send(JSON.parse(fs.readFileSync(path.join(req.body.path, `/config.json`))));
});

router.put("/update", function(req, res) {
    console.log(req.body.path," ", req.body.data) 
    fs.writeFileSync(path.join(req.body.path, `/config.json`), JSON.stringify(req.body.data))
    res.send({status: "ok"})
});

module.exports = router;