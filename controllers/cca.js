const CCA = require('../models/cca')

module.exports.showAllCCA = async (req, res) => {
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

module.exports.showOneCCA = async (req, res) => {
    const cca = await CCA.findById(req.params.id).populate('officer').populate('interested').populate('events')
    res.render('cca/show', { cca })
}

module.exports.editCCA = async (req, res) => {
    const cca = await CCA.findByIdAndUpdate(req.params.id, { ...req.body.cca })
    await cca.save()
    res.redirect(`/cca/${cca._id}`)
}

module.exports.deleteCCA = async (req, res) => {
    const cca = await CCA.findByIdAndDelete(req.params.id)
    res.redirect('/cca')
}

module.exports.renderCCAForm = (req, res) => {
    res.render('cca/new')
}

module.exports.renderEditForm = async (req, res) => {
    const cca = await CCA.findById(req.params.id)
    if (!cca) {
        return res.redirect('/cca')
    }
    res.render('cca/edit', { cca })
}

module.exports.registerInterest = async (req, res) => {
    const cca = await CCA.findById(req.params.id)
    cca.interested.push(req.user._id)
    await cca.save()
    req.flash('success', 'Successfully registered interest in CCA!')
    res.redirect(`/cca/${cca._id}`)
}

module.exports.viewMembers = async (req, res) => {
    const cca = await CCA.findById(req.params.id).populate('members').populate('officer').populate('interested')
    res.render('cca/member', { cca })
}

module.exports.acceptStudent = async (req, res) => {
    const { id, studentId } = req.params
    const cca = await CCA.findById(id)
    cca.members.push(studentId)
    await cca.save()
    await CCA.findByIdAndUpdate(id, { $pull: { interested: studentId } })
    req.flash('success', 'Successfully accepted interested student!')
    res.redirect(`/cca/${cca._id}/viewmembers`)
}

module.exports.rejectStudent = async (req, res) => {
    const { id, studentId } = req.params
    await CCA.findByIdAndUpdate(id, { $pull: { interested: studentId } })
    req.flash('success', 'Successfully rejected interested student.')
    res.redirect(`/cca/${id}/viewmembers`)
}

module.exports.removeMember = async (req, res) => {
    const { id, studentId } = req.params
    await CCA.findByIdAndUpdate(id, { $pull: { members: studentId } })
    req.flash('success', 'Successfully removed student as member.')
    res.redirect(`/cca/${id}/viewmembers`)
}

module.exports.makeAdmin = async (req, res) => {
    const { id, studentId } = req.params
    const cca = await CCA.findById(id)
    cca.officer.push(studentId)
    await cca.save()
    req.flash('success', 'Successfully added member as admin!')
    res.redirect(`/cca/${cca._id}/viewmembers`)
}

module.exports.removeAdmin = async (req, res) => {
    const { id, studentId } = req.params
    await CCA.findByIdAndUpdate(id, { $pull: { officer: studentId } })
    req.flash('success', 'Sucessfully removed member as admin.')
    res.redirect(`/cca/${id}/viewmembers`)
}