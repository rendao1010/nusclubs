const Event = require('../models/event')
const CCA = require('../models/cca')
const { cloudinary } = require('../cloudinary')

module.exports.showEvent = async (req, res) => {
    const event = await Event.findById(req.params.eventId).populate('cca').populate('attending', 'username')
    res.render('event/show', { event })
}

module.exports.createForm = async (req, res) => {
    const cca = await CCA.findById(req.params.id)
    res.render('event/new', { cca })
}

module.exports.editForm = async (req, res) => {
    const event = await Event.findById(req.params.eventId).populate('cca')
    res.render('event/edit', { event })
}

module.exports.createEvent = async (req, res) => {
    const cca = await CCA.findById(req.params.id)
    const event = new Event(req.body.event)
    if (req.file) {
        event.image = { url: req.file.path, filename: req.file.filename }
    }
    event.cca = req.params.id
    cca.events.push(event)
    await event.save()
    await cca.save()
    res.redirect(`/cca/${req.params.id}/events/${event._id}`)
}

module.exports.updateEvent = async (req, res) => {
    const { id, eventId } = req.params
    const event = await Event.findByIdAndUpdate(eventId, { ...req.body.event })
    if (req.file) {
        if (event.image) {
            cloudinary.uploader.destroy(event.image.filename)
        }
        event.image = { url: req.file.path, filename: req.file.filename }
    }
    await event.save()
    if (req.body.delete) {
        await cloudinary.uploader.destroy(req.body.delete)
        await event.updateOne({ $unset: { image: "" } })
    }
    res.redirect(`/cca/${id}/events/${eventId}`)
}

module.exports.deleteEvent = async (req, res) => {
    const { id, eventId } = req.params
    await Event.findByIdAndDelete(eventId)
    res.redirect(`/cca/${id}`)
}

module.exports.attendEvent = async (req, res) => {
    const { id, eventId } = req.params
    if (req.user) {
        const event = await Event.findById(eventId)
        event.attending.push(req.user)
        req.user.attending.push(event)
        await event.save()
        await req.user.save()
        req.flash('success', 'Successfully registered attendance for event!')
        res.redirect(`/cca/${id}/events/${eventId}`)
    } else {
        res.redirect('/login')
    }
}