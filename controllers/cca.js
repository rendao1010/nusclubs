const CCA = require('../models/cca')

module.exports.showCCA = async (req, res) => {
    const ccas = await CCA.find({})
    res.render('cca/index', { ccas })
}

module.exports.createCCA = async (req, res) => {
    const { title, description, phone, email } = req.body
    const cca = new CCA({ title, description, phone, email })
    cca.officer.push(req.user._id)
    await cca.save()
    res.redirect('/cca')
}