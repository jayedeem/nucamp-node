const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const passport = require('passport')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const mongoose = require('mongoose')
const config = require('./config')
const uploadRouter = require('./routes/uploadRouter')
// Middleware
const auth = require('./auth')
const authenticate = require('./authenticate')
// Routes
const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const campsiteRouter = require('./routes/campsiteRouter')
const promotionRouter = require('./routes/promotionRouter')
const partnerRouter = require('./routes/partnerRouter')

const url = config.mongoUrl
const connect = mongoose.connect(url, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
})

// Run server mongod --dbpath=data
connect.then(
  () => console.log('Connected correctly to server'),
  (err) => console.log(err)
)

const app = express()
app.all('*', (req, res, next) => {
  if (req.secure) {
    return next()
  } else {
    console.log(
      `Redirecting to: https://${req.hostname}:${app.get('secPort')}${req.url}`
    )
    res.redirect(301, `https://${req.hostname}:${app.get('secPort')}${req.url}`)
  }
})
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')
// app.use(cookieParser('12345-67890-09876-54321'));

app.use(cookieParser())

app.use(
  session({
    name: 'session-id',
    secret: '12345-67890-09876-54321',
    saveUninitialized: false,
    resave: false,
    store: new FileStore()
  })
)

app.use(passport.initialize())
app.use(passport.session())

app.use('/', indexRouter)
app.use('/users', usersRouter)

app.use('/imageUpload', uploadRouter)
app.use(express.static(path.join(__dirname, 'public')))
app.use('/campsites', campsiteRouter)
app.use('/promotions', promotionRouter)
app.use('/partners', partnerRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
