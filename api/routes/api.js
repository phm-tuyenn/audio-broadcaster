var express = require("express");
var fs = require("fs")
var router = express.Router();

router.get("/", function(req, res) {
    res.send({apiStatus: "ok"});
});

router.post("/read", function(req, res) {
    res.send(JSON.parse(fs.readFileSync(`../data/${req.body.file}.json`)));
});

router.put("/update", function(req, res) {
    fs.writeFileSync(`../data/${req.body.file}.json`, JSON.stringify(req.body.data))
    console.log("ok")
    res.send({ status: "ok" })
});

module.exports = router;