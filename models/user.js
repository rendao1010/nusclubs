const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')

const UserSchema = new Schema({
    email: String,
    faculty: String,
    course: String,
    year: Number,
    attending: [{
        type: Schema.Types.ObjectId,
        ref: "Event"
    }]
})

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', UserSchema)