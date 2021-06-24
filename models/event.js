const mongoose = require('mongoose')
const Schema = mongoose.Schema

const imageSchema = new Schema({
    url: String,
    filename: String
})

imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_800')
})

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
    ],
    image: imageSchema
})

module.exports = mongoose.model("Event", eventSchema)