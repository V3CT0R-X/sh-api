var express = require('express');
var router = express.Router();
var request = require('request');

var db = require('../db.js').db;

const hostUrl = "http://127.0.0.1";

/* GET users listing. */
router.get('/', function(req, res, next) {
    //TODO: only have NodeMCU access this
    res.status(200).send(db.pins.join(''));
    for(var i=0;i<db.pins.length;i++)
        db.pins[i] = 0;
});

module.exports = router;
