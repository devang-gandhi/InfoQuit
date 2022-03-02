const express = require('express')
const mongoose  = require('mongoose')
const dotenv = require('dotenv')
const connect = require('./config/db')
const morgan = require('morgan')
const methodOverride = require('method-override')
const {engine} = require('express-handlebars')
const path = require('path')
const passport = require('passport')
const session = require('express-session')
const sessionstore = require('connect-mongo')



const app = express()


dotenv.config({ path:'./config/config.env'})

require('./config/passport')(passport)

connect()

app.use(express.urlencoded( {extended: false}))
app.use(express.json())

app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
}))

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

const {formatdate,truncate,stripTags,editIcon,select} = require('./helper/hbs')

app.engine('.hbs', engine({helpers : {
    formatdate,
    stripTags,
    truncate,
    editIcon,
    select
} ,defaultLayout : 'main' ,extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: sessionstore.create({
        mongoUrl: process.env.URI
    })
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(function(req,res,next){
    res.locals.user = req.user || null
    next()
})

app.use(express.static(path.join(__dirname, 'public')))

app.use('/' , require('./routes/index'))
app.use('/auth' , require('./routes/auth'))
app.use('/infos' , require('./routes/info'))

const port = process.env.PORT || 5000;
app.listen(port , console.log(`Server is listening ${process.env.NODE_ENV} on ${port}`));

