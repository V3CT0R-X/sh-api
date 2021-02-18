var express = require('express');
var router = express.Router();
var User = require('../model/user');
var Room = require('../model/room');
var Device = require('../model/device');
var Node = require('../model/node');
var jwt = require('jsonwebtoken');
var secrets = require('../secrets');
var mongoose = require('mongoose');
const { Schema } = require('mongoose');
var accessTokenSecret = secrets.accessTokenSecret;

/**
 * add a room
 */
router.post('/rooms/add', function (req, res, next) {
    var title = req.body.title;
    //var node_id = req.body.node_id;

    var token = req.body.token;

    var email = null;

    //TODO: validation

    if (!title || title.length == 0) {
        res.json({ err: "a field is blank." });
        return;
    }

    jwt.verify(token, secrets.accessTokenSecret, function (err, decoded) {
        if (err) {
            res.status(400).json({ err: "Invalid token" });
            return;
        }
        User.findOne({ email: decoded.email }, function (err, user) {
            if (err | !user) {
                res.status(400).json({ err: "Invalid token" });
                return;
            }

            var room = new Room({
                title: title,
                devices: [],
            });

            room.save(function (err, r) {
                if (err) {
                    res.status(500).json({ err: "Server error" });
                    console.log(err);
                    return;
                }
                var node = new Node({
                    url: 'control', //static for now. change later.
                    room: r.id
                });
                node.save(function (err, _) {
                    if (err) {
                        res.status(500).json({ err: "Server error" });
                        console.log(err);
                        return;
                    }
                    User.updateOne({ _id: user.id }, { $push: { rooms: r.id } }, (err) => {
                        if (err) {
                            console.log(err);
                            res.status(500).json({ err: "Server error" });
                            return;
                        }

                        res.status(200).json(r);
                    })
                });
            });
            //res.status(200).send("Success");
        });
    });
});

router.post('/rooms/list', function (req, res, next) {
    var token = req.body.token;

    jwt.verify(token, secrets.accessTokenSecret, function (err, decoded) {
        if (err) {
            res.status(400).json({ err: "Invalid token" });
            return;
        }
        User.findOne({ email: decoded.email }, function (err, user) {
            if (err | !user) {
                res.status(400).json({ err: "Invalid token" });
                return;
            }

            //user.rooms = user.rooms.map(x=>mongoose.Types.ObjectId(x));
            //console.log(user.rooms);

            //now retrieve all rooms along with devices in them
            Room.find().where('_id').in(user.rooms).exec(function (err, rooms) {
                if (err) {
                    console.log(err);
                    res.status(500).json({ err: "Unable to gather room data" });
                    return;
                }
                //console.log("err",err);
                //console.log(rooms);
                res.status(200).json(rooms);
            });
        });
    });
});

/*
    add device
*/
router.post('/devices/add', function (req, res, next) {
    var title = req.body.title;
    // var node_id = req.body.node_id;
    var pin = req.body.pin;
    var room_id = req.body.room_id;
    var token = req.body.token;
    //TODO: validation

    jwt.verify(token, secrets.accessTokenSecret, function (err, decoded) {

        if (err) {
            res.status(400).json({ err: "Invalid token" });
            return;
        }
        User.findOne({ email: decoded.email }, function (err, user) {
            if (err | !user) {
                res.status(400).json({ err: "Invalid token" });
                return;
            }

            Node.findOne({ room: room_id }, function (err, node) {

                if (err | !node) {
                    console.log("couldn't find node in room", room_id);
                    console.log(err);
                    res.status(500).json({ err: "Server error" });
                    return;
                }

                var node_id = node.id;

                var device = new Device({
                    title: title,
                    node_id: node_id,
                    pin: pin,
                });
                device.save(function (err, dev) {
                    if (err) {
                        console.log("couldn't save dev", device);
                        console.log(err);
                        res.status(500).json({ err: "Server error" });
                        return;
                    }
                    Room.updateOne({ _id: room_id }, { $push: { devices: dev.id } }, (err) => {
                        if (err) {
                            console.log("couldn't update room", room_id);
                            console.log(err);
                            res.status(500).json({ err: "Server error" });
                            return;
                        }
                        res.status(200).json(dev);
                    });
                });
            })


        });
    });

});

router.post('/devices/control', function (req, res, next) {
    var token = req.body.token;
    var room_id = req.body.room_id;
    var device_id = req.body.device_id;
    var pin = req.body.pin;

    jwt.verify(token, secrets.accessTokenSecret, function (err, decoded) {
        if (err) {
            res.status(400).json({ err: "Invalid token" });
            return;
        }
        User.findOne({ email: decoded.email }, function (err, user) {
            if (err | !user) {
                res.status(400).json({ err: "Invalid token" });
                return;
            }
            Room.findOne({ _id: room_id }, function (err, room) {
                if (err) {
                    console.log(err);
                    res.status(500).json({ err: "Unable to gather room data" });
                    return;
                }

                Device.findOne({ _id: device_id }, function (err, dev) {
                    if (err) {
                        console.log(err);
                        res.status(500).json({ err: "Unable to gather device data" });
                        return;
                    }
                    var pin = dev.pin;
                    var node_id = dev.node_id;
                    Node.findOne({ _id: node_id }, function (err, node) {
                        if (err) {
                            console.log(err);
                            res.status(500).json({ err: "Unable to gather room data" });
                            return;
                        }
                        if (pin > 4) {
                            res.status(400).json({ err: "Bad object found. Remove the device and reset the pin" });
                            return;
                        }
                        node.pinstr[pin - 1] = "1";
                        node.save(function (err, n) {
                            if (err) {
                                console.log("err while saving node", err);
                                return;
                            }
                            console.log(n);
                        });
                    });
                });
            });
        });
    });

});

router.post('/devices/list', function (req, res, next) {
    var token = req.body.token;
    var room_id = req.body.room_id;

    jwt.verify(token, secrets.accessTokenSecret, function (err, decoded) {
        if (err) {
            res.status(400).json({ err: "Invalid token" });
            return;
        }
        User.findOne({ email: decoded.email }, function (err, user) {
            if (err | !user) {
                res.status(400).json({ err: "Invalid token" });
                return;
            }

            var room_found = false;

            for (var i = 0; i < user.rooms.length; i++) {
                if (user.rooms[i] == room_id) {
                    room_found = true;
                    break;
                }
            }

            //console.log("the user",user);

            if (!room_found) {
                res.status(500).json({ err: "Room not found for this user" });
                return;
            }

            Room.findOne({ _id: room_id }, function (err, room) {
                if (err) {
                    console.log(err);
                    res.status(500).json({ err: "Unable to gather room data" });
                    return;
                }
                //res.status(200).json(room.devices);
                //console.log("room",room);
                //console.log("room devices", room.devices);
                Device.find().where('_id').in(room.devices).exec(function (err, devs) {

                    if (err) {
                        console.log(err);
                        res.status(500).json({ err: "Unable to gather devices data" });
                        return;
                    }
                    console.log(devs);
                    res.status(200).json(devs);
                });

            });
        });
    });
});

module.exports = router;
