const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')

const UserSchema = new Schema({
    email: String,
    faculty: String,
    course: String,
    year: Number
})

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', UserSchema)