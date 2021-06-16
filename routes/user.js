const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../models/user')

router.get('/register', (req, res) => {
    res.render('user/register')
})

router.post('/register', async (req, res, next) => {
    const { username, email, faculty, course, year, password } = req.body
    const user = new User({ username, email, faculty, course, year })
    const registeredUser = await User.register(user, password)
    req.login(registeredUser, err => {
        if (err) return next(err)
        res.redirect('/cca')
    })
})

router.get('/login', (req, res) => {
    res.render('user/login')
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    res.redirect('/cca')
})

router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/cca')
})

module.exports = router