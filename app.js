const express = require('express')
const router = express.Router()
const path = require('path')
const mongoose = require('mongoose')
const eventRoutes = require('./routes/event')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
const methodOverride = require('method-override')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')

const Event = require('./models/event')

const ccaRoutes = require('./routes/cca')
const userRoutes = require('./routes/user')

mongoose.connect('mongodb://localhost:27017/nusclubs', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error'))
db.once('open', () => {
    console.log('Database connected')
})

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: 'samplesecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use('/', userRoutes)
app.use('/cca', ccaRoutes)
app.use('/cca/:id/events', eventRoutes)

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/news', async (req, res) => {
    let events = await Event.find().populate('cca', 'title')
    res.render('news', { events })
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})