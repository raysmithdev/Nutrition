var
express = require('express'),
app = express(),
bodyParser = require('body-parser'),
request = require('request'),
mongoose = require('mongoose'),
logger = require('morgan'),
config = require('./config.js'),
dotenv = require('dotenv').load({silent: true}), // silent: true just ensures the program doesn't throw an error if it can't find the dotenv file
ejs = require('ejs'),
ejsLayouts = require('express-ejs-layouts'),
flash = require('connect-flash'),
cookieParser = require('cookie-parser'), // used to read the cookies that are created
bodyParser = require('body-parser'),
session = require('express-session'), // used to create cookies
passport = require('passport'), // used for authentication
passportConfig = require('./config/passport.js'),
nodemailer = require('nodemailer'),
methodOverride = require('method-override'),
moment = require('moment'),
// googleButton = require('bootstrap-social'),
nutritionix = require('nutritionix')({
  appId: process.env.APPID,
  appKey: process.env.APPKEY
}, false),
PORT = process.env.PORT || 3000, // heroku doesn't like port 3000 so this ensures heroku will pick its own port or use 3000
userRoutes = require('./routes/users.js'),
apiRoutes = require('./routes/api.js')

// connect to mLabs database
mongoose.connect(config.DATABASE_URL, function(err){
  if (err) return console.log(err);
  console.log("Connected to MongoDB (Nutrition Nut)");
})

// middleware
app.use(bodyParser.json());
app.use(express.static('./public'))
app.use(logger('dev'))
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: false})) // this allows us to use our forms with bodyparser
app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}))

// ejs configuration
app.set('view engine', 'ejs')
app.use(ejsLayouts)
app.use(flash())

// this is the session and passport middleware
app.use(session({
  cookie: {maxTime: 60000000}, // 16.6 hours in milliseconds
  secret: "Wazzzuuuup", // this adds an encrypter version of this secret so that a user cant just add a cookie in the browser and be logged in...very cruial
  resave: true, // if you are continually using the site, you will stay logged in as long as you want
  saveUninitialized: false // means, "do you want to create a cookie even if the login fails?".. answer is NO
}))
app.use(passport.initialize())
app.use(passport.session()) // this is what allows the cookie to get created, when necessary

app.use(function(req, res, next) {
  res.locals.user = req.user
  next()
})

// set the landing page as the default page
app.get('/', function(req, res){
  res.render('landing.ejs', {flash: req.flash('loginMessage')})
})

//root route
app.get('/user', function(req,res){
  res.render('index')
})

app.use('/', userRoutes)
app.use('/', apiRoutes)

// Connect to server
app.listen(PORT, function(){
  console.log('Server is running on port: ', PORT);
})

// required for logging in with your Google account information
app.get('/auth/google',
passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

app.get('/auth/google/callback/',
passport.authenticate('google', { failureRedirect: '/login' }),
function(req, res) {
  res.redirect('/');
});