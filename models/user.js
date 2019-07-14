var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: {type: String},
    log:[{
    systolic: {type: Number},
    diastolic: {type: Number},
    date: {type: Date, default: Date.now},
    activity: {type: String},
    lemonwater: {type: String, enum: ['yes', 'no']}}
    ]
})


module.exports = mongoose.model('User', UserSchema)