if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

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
const mongoSanitize = require('express-mongo-sanitize')
const User = require('./models/user')
const dbUrl = process.env.DB_URL

const Event = require('./models/event')

const ccaRoutes = require('./routes/cca')
const userRoutes = require('./routes/user')

// local address: 'mongodb://localhost:27017/nusclubs'
mongoose.connect(dbUrl, {
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
app.use(mongoSanitize())

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
    let events = await Event.find({}).populate('cca', 'title')
    events.reverse()
    res.render('news', { events })
})

// 21/07/2021 00.00
app.get('/upcoming', async (req, res) => {
    if (!req.user) {
        return res.redirect('/login')
    }
    const user = await User.findById(req.user._id).populate('attending')
    user.attending.sort((a, b) => {
        var date1 = new Date(a.start.slice(6,10), a.start.slice(3,5), a.start.slice(0,2), a.start.slice(11,13), a.start.slice(-2), 00)
        var date2 = new Date(b.start.slice(6,10), b.start.slice(3,5), b.start.slice(0,2), b.start.slice(11,13), b.start.slice(-2), 00)
        if (date1 > date2) {
            return 1
        } else {
            return -1
        }
    })
    res.render('upcoming', { user })
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})