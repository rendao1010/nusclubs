const express = require('express')
const routere = express.Router()
const path = require('path')
const mongoose = require('mongoose')
const ccaRoutes = require('./routes/cca')
const methodOverride = require('method-override')

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

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use('/cca', ccaRoutes)

app.get('/', (req, res) => {
    res.render('home')
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})