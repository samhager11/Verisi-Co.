//BASE SETUP
//=============================================================================

//CALL THE PACKAGES ----------------------------------------------------------
var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    adminRoutes = require('./routes/admin-router.js'),
    apiRoutes = require('./routes/api-router.js'),
    port = process.env.PORT || 8080



//APP CONFIGURATION ----------------------------------------------------------

//establishes connection to mongo database(that can be anywhere)
mongoose.connect('mongodb://samhager11:password@ds027335.mongolab.com:27335/project4')


//use body parser to grab information from POST requests
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//use express to join public to route names for static pages and render ejs views through index.html
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')

//configure app to handle CORS(cross origin resource sharing) requests
//allows any domain to access the API
app.use(function(req, res, next){
    res.setHeader('Acces-Control-Allow-Origin', '*')
    res.setHeader('Acces-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    res.setHeader('Acces-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization')

    next()
})

//log all requests to the console using morgan
app.use(morgan('dev'))

//send index.html file to the user for the home page
app.get('/', function(req,res){
	console.log('getting index?')
	res.render('index')
})

//REGISTER ROUTES -------------------------------------------------------------
//apply the Admin routes to application
app.use('/admin', adminRoutes)
//apply the API routes to application
app.use('/api/v1', apiRoutes)


//start the server
app.listen(port);
console.log('Magic happens on port ' + port);
