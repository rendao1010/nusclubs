const Event = require('../models/event')
const CCA = require('../models/cca')

module.exports.showEvent = async (req, res) => {
    const event = await Event.findById(req.params.eventId).populate('cca', 'title')
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
    event.cca = req.params.id
    cca.events.push(event)
    await event.save()
    await cca.save()
    res.redirect(`/cca/${req.params.id}/events/${event._id}`)
}

module.exports.updateEvent = async (req, res) => {
    const { id, eventId } = req.params
    const event = await Event.findByIdAndUpdate(eventId, { ...req.body.event })
    await event.save()
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
        await event.save()
        res.redirect(`/cca/${id}/events/${eventId}`)
    } else {
        res.redirect('/login')
    }
}