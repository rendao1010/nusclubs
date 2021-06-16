const express = require('express')
const router = express.Router({ mergeParams: true })
const eventControllers = require('../controllers/event')

router.post('/', eventControllers.createEvent)

router.get('/new', eventControllers.createForm)

router.route('/:eventId')
    .get(eventControllers.showEvent)
    .put(eventControllers.updateEvent)
    .delete(eventControllers.deleteEvent)

router.get('/:eventId/edit', eventControllers.editForm)

module.exports = router