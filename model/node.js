var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NodeSchema = new Schema({
    url: {type: String, required: true},
    room: {type: Schema.Types.ObjectId, required:true},
    pinstr: {type: String, default: '0000'}
});

module.exports = mongoose.model('Node',NodeSchema);

