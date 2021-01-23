var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RoomSchema = new Schema(
    {
        title: {type: String, required: true},
        devices: [{type: Schema.Types.ObjectId, ref: 'Device'}]
        //node_id: {type: Number, required: true}, //MAYBE refactor? or add checks?
        // owner_ids: [{type: Schema.Types.ObjectId, ref: 'User'}],
        //pins: [{type: Number}]
    }
);

module.exports = mongoose.model('Room',RoomSchema);