var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var User = require('../model/user');
var jwt = require('jsonwebtoken');
var secrets = require('../secrets');
var accessTokenSecret = secrets.accessTokenSecret;

router.post('/', function (req, res, next) {
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var password = req.body.password;
    var email = req.body.email;
    var city = req.body.city;
    //TODO validation of everything
    //TODO check presence of already registered email
    console.log(req.body);
    bcrypt.hash(password, 10, function (err, hash) {
        if (err) {
            console.log(err);
            res.json({ err: "Error while hashing password" }); //TODO: send object instead
        } else {
            var user = new User({
                first_name: first_name,
                last_name: last_name,
                password: hash,
                email: email,
                city: city
            });
            user.save(function (err) {
                if (err) {
                    console.log(err);
                    res.json({ err: "Something wrong while storing." });
                }
                //res.send("Done."); //MAYBE SEND JS LATER
                const accessToken = jwt.sign({ email: email, first_name: first_name }, accessTokenSecret);
                res.json({ res: accessToken });
            });
        }
    });

});

router.get('/', function (req, res, next) {
    res.send('yo');
})

module.exports = router;
