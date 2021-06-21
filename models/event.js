const mongoose = require('mongoose')
const Schema = mongoose.Schema

const eventSchema = new Schema({
    title: String,
    description: String,
    start: String,
    end: String,
    cca: {
        type: Schema.Types.ObjectId,
        ref: 'CCA'
    },
    attending: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
})

module.exports = mongoose.model("Event", eventSchema)