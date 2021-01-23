var express = require('express');
var router = express.Router();
var request = require('request');

var db = require('../db.js').db;

const hostUrl = "http://127.0.0.1";

/* GET users listing. */
router.get('/:pin', function(req, res, next) {
    return; //DISABLED
   const {pin} = req.params;

    res.status(200).send(""+db.pins[pin]);
    db.pins[pin] = 0;
});

module.exports = router;
