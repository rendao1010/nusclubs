const mongoose = require('mongoose')
const Event = require('./event')
const Schema = mongoose.Schema

const CCASchema = new Schema({
    title: String,
    description: String,
    phone: Number,
    email: String,
    events: [
        {
            type: Schema.Types.ObjectId,
            ref: "Event"
        }
    ],
    officer: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    interested: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
})

CCASchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Event.deleteMany({
            _id: {
                $in: doc.events
            }
        })
    }
})

module.exports = mongoose.model('CCA', CCASchema)