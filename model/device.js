var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DeviceSchema = new Schema({
    title: {type: String, required: true},
    node_id: {type: Schema.Types.ObjectId, ref: 'Node', required: true},
    pin: {type: Number, required: true},
});

module.exports = mongoose.model('Device',DeviceSchema);