const express = require('express')
const router = express.Router({ mergeParams: true })
const eventControllers = require('../controllers/event')
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })

router.post('/', upload.single('event[image]'), eventControllers.createEvent)

router.get('/new', eventControllers.createForm)

router.route('/:eventId')
    .get(eventControllers.showEvent)
    .post(eventControllers.attendEvent)
    .put(upload.single('event[image]'), eventControllers.updateEvent)
    .delete(eventControllers.deleteEvent)

router.get('/:eventId/edit', eventControllers.editForm)

module.exports = router