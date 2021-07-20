const express = require('express')
const router = express.Router()
const { isLoggedIn } = require('../middleware')
const ccaControllers = require('../controllers/cca')

const app = express()

const CCA = require('../models/cca')

router.route('/')
    .get(ccaControllers.showAllCCA)
    .post(isLoggedIn, ccaControllers.createCCA)

router.get('/new', ccaControllers.renderCCAForm)

router.route('/:id')
    .get(ccaControllers.showOneCCA)
    .put(ccaControllers.editCCA)
    .delete(ccaControllers.deleteCCA)

router.get('/:id/edit', ccaControllers.renderEditForm)

router.get('/:id/register', ccaControllers.registerInterest)

router.get('/:id/viewmembers', ccaControllers.viewMembers)

router.get('/:id/accept/:studentId', ccaControllers.acceptStudent)

router.get('/:id/reject/:studentId', ccaControllers.rejectStudent)

router.get('/:id/remove/:studentId', ccaControllers.removeMember)

router.get('/:id/makeadmin/:studentId/add', ccaControllers.makeAdmin)

router.get('/:id/makeadmin/:studentId/remove', ccaControllers.removeAdmin)

router.post('/search', (req, res) => {
    res.redirect(`/cca/search/${req.body.search}`)
})

router.get('/search/:query', async (req, res) => {
    const { query } = req.params
    const ccas = await CCA.find({ title: new RegExp(query, 'i') })
    res.render('cca/search', { ccas })
})

module.exports = router