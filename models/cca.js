const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CCASchema = new Schema({
    title: String,
    description: String,
    phone: Number,
    email: String,
    events: String,
    officer: String
})

module.exports = mongoose.model('CCA', CCASchema)