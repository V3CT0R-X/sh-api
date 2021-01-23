var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var User = require('../model/user');
var jwt = require('jsonwebtoken');
var secrets = require('../secrets');
var accessTokenSecret = secrets.accessTokenSecret;

router.post('/', function(req, res, next) {
    var password = req.body.password;
    var email = req.body.email;
    //TODO validation of everything
    //TODO check presence of already registered email
    User.findOne({email: email}, 'password', function(err, doc) {
        if(err) {
            console.log(err);
            res.json({err:"Error while accessing database"});
            return;
        }
        if(!doc || !doc.password) {
            console.log("not found ig.");
            res.json({err:"Incorrect username or password"});
            return;
        }
        dbpass = doc.password;
        bcrypt.compare(password, dbpass, function(err, same) {
            if(err) {
                console.log(err);
                res.json({err:"Incorrect username or password"});
                return;
            }
            if(!same) {
                console.log("is differe,t");
                res.json({err:"Incorrect username or password"});
                return;
            }
            const accessToken = jwt.sign({email: email}, accessTokenSecret);
            res.json({res:accessToken});
        });
    });

});

module.exports = router;
