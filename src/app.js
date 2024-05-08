const express    = require('express')
const handlebars = require('express-handlebars')
const appRouter  = require('./routes')
const { configObject, connectDb } = require('./config')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const { initializePassport } = require('./passport-jwt/passport.config')
const cors = require('cors')

const app = express()
const PORT = configObject.PORT

const httpServer = app.listen(PORT, err => {
    if (err) console.log(err)
    console.log(`Server listening in port: ${PORT}`)
})

connectDb()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('./src/public'))

app.use(cookieParser())
app.use(cors())

app.engine('hbs', handlebars.engine({
    extname: '.hbs'
}))
app.set('view engine', 'hbs')
app.set('views', './src/views')

initializePassport()
app.use(passport.initialize())

app.use(appRouter)