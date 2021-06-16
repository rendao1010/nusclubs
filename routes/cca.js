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
    const cca = new CCA(req.body.cca)
    await cca.save()
    console.log(cca)
    res.redirect('/cca')
})

router.get('/:id', async (req, res) => {
    const cca = await CCA.findById(req.params.id)
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

module.exports = router