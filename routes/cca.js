const express = require('express')
const router = express.Router()
const { isLoggedIn } = require('../middleware')
const ccaControllers = require('../controllers/cca')

const app = express()

const CCA = require('../models/cca')

router.route('/')
    .get(ccaControllers.showCCA)

router.get('/new', (req, res) => {
    res.render('cca/new')
})

router.post('/', isLoggedIn, async (req, res) => {
    const { title, description, phone, email } = req.body
    const cca = new CCA({ title, description, phone, email })
    cca.officer.push(req.user._id)
    await cca.save()
    res.redirect('/cca')
})

router.post('/search', (req, res) => {
    res.redirect(`/cca/search/${req.body.search}`)
})

router.get('/search/:query', async (req, res) => {
    const { query } = req.params
    const ccas = await CCA.find({ title: new RegExp(query, 'i') })
    res.render('cca/index', { ccas })
})

router.get('/:id', async (req, res) => {
    const cca = await CCA.findById(req.params.id).populate('officer').populate('interested').populate('events')
    res.render('cca/show', { cca })
})

router.put('/:id', async (req, res) => {
    const cca = await CCA.findByIdAndUpdate(req.params.id, { ...req.body.cca })
    await cca.save()
    res.redirect(`/cca/${cca._id}`)
})

router.delete('/:id', async (req, res) => {
    const cca = await CCA.findByIdAndDelete(req.params.id)
    res.redirect('/cca')
})

router.get('/:id/edit', async (req, res) => {
    const cca = await CCA.findById(req.params.id)
    if (!cca) {
        return res.redirect('/cca')
    }
    res.render('cca/edit', { cca })
})

router.get('/:id/register', async (req, res) => {
    const cca = await CCA.findById(req.params.id)
    cca.interested.push(req.user._id)
    await cca.save()
    req.flash('success', 'Successfully registered interest in CCA!')
    res.redirect(`/cca/${cca._id}`)
})

router.get('/:id/viewmembers', async (req, res) => {
    const cca = await CCA.findById(req.params.id).populate('members').populate('officer').populate('interested')
    res.render('cca/member', { cca })
})

router.get('/:id/accept/:studentId', async (req, res) => {
    const { id, studentId } = req.params
    const cca = await CCA.findById(id)
    cca.members.push(studentId)
    await cca.save()
    await CCA.findByIdAndUpdate(id, { $pull: { interested: studentId } })
    req.flash('success', 'Successfully accepted interested student!')
    res.redirect(`/cca/${cca._id}/viewmembers`)
})

router.get('/:id/reject/:studentId', async (req, res) => {
    const { id, studentId } = req.params
    await CCA.findByIdAndUpdate(id, { $pull: { interested: studentId } })
    req.flash('success', 'Successfully rejected interested student.')
    res.redirect(`/cca/${id}/viewmembers`)
})

router.get('/:id/remove/:studentId', async (req, res) => {
    const { id, studentId } = req.params
    await CCA.findByIdAndUpdate(id, { $pull: { members: studentId } })
    req.flash('success', 'Successfully removed student as member.')
    res.redirect(`/cca/${id}/viewmembers`)
})

router.get('/:id/makeadmin/:studentId/add', async (req, res) => {
    const { id, studentId } = req.params
    const cca = await CCA.findById(id)
    cca.officer.push(studentId)
    await cca.save()
    req.flash('success', 'Successfully added member as admin!')
    res.redirect(`/cca/${cca._id}/viewmembers`)
})

router.get('/:id/makeadmin/:studentId/remove', async (req, res) => {
    const { id, studentId } = req.params
    await CCA.findByIdAndUpdate(id, { $pull: { officer: studentId } })
    req.flash('success', 'Sucessfully removed member as admin.')
    res.redirect(`/cca/${id}/viewmembers`)
})

module.exports = router