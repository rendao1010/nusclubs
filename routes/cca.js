const express = require('express')
const router = express.Router()

const app = express()

const CCA = require('../models/cca')

router.get('/', async (req, res) => {
    const ccas = await CCA.find({})
    res.render('cca/index', { ccas })
})

router.get('/new', (req, res) => {
    res.render('cca/new')
})

router.post('/', async (req, res) => {
    const { title, description, phone, email } = req.body
    const cca = new CCA({ title, description, phone, email })
    cca.officer = req.user._id
    await cca.save()
    res.redirect('/cca')
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
    res.redirect(`/cca/${cca._id}`)
})

router.get('/:id/accept/:studentId', async (req, res) => {
    const { id, studentId } = req.params
    const cca = await CCA.findById(id)
    cca.members.push(studentId)
    await cca.save()
    await CCA.findByIdAndUpdate(id, { $pull: { interested: studentId } })
    res.redirect(`/cca/${cca._id}`)
})

module.exports = router