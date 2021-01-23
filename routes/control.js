var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var secrets = require('../secrets');

var db = require('../db.js').db;

const hostUrl = "http://127.0.0.1";

/* GET users listing. */
//router.get('/', function(req, res, next) {
//  res.send('respond with a resource');
//});

/**
 * takes pin as url param
 * takes email and token in post body
 * verifies token and status 200 if token is correct.
 * returns status 400 in all other cases
 */
router.post('/:pin',function(req,res,next) {
    const pin = req.params.pin;
    const email = req.body.email;
    //ONLY client which sends token will be able to call this.
    //TODO: add more security checks.
    const token = req.body.token;
    if(!token || !email) {
        res.status(400).send("Bad request"); //bad request
        return;
    }
    //token verify
    jwt.verify(token, secrets.accessTokenSecret, function(err, decoded) {
        if(err) {
            res.status(400).send("Invalid token");
            return;
        }

        if(decoded.email == email) {
            res.status(400).send("Incorrect token");
            return;
        }
        if(db.pins.length <= pin) {
            res.status(400).send("Invalid pin number.");
            return;
        }
        db.pins[pin] = 1;//Number(!db.pins[pin]);

        res.status(200).send("OK");
    });
});

module.exports = router;
