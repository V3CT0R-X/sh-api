var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema(
    {
        first_name: {type: String, required: true},
        last_name: {type: String, required: false},
        email: {type: String, required: true}, //ADD validators for everything
        password: {type: String, required: true},
        rooms: [{type: Schema.Types.ObjectId, ref: 'Room'}]
    }
);

module.exports = mongoose.model('User',UserSchema);