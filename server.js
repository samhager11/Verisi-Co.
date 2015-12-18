//BASE SETUP
//=============================================================================

//CALL THE PACKAGES ----------------------------------------------------------
var express = require('express'),
    app = express(),
    ejs = require('ejs'),
    path = require('path')
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    adminRoutes = require('./routes/admin-router.js'),
    apiRoutes = require('./routes/api-router.js'),
    config = require('./configuration/config.js')



//APP CONFIGURATION ----------------------------------------------------------

//establishes connection to mongo database(that can be anywhere)
mongoose.connect(config.database)


//use body parser to grab information from POST requests
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//use express to join public to route names for static pages and render ejs views through index.html
// app.set('view engine', 'ejs')
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static('public'))


//configure app to handle CORS(cross origin resource sharing) requests
//allows any domain to access the API
app.use(function(req, res, next){
    res.setHeader('Acces-Control-Allow-Origin', '*')
    res.setHeader('Acces-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    res.setHeader('Acces-Control-Allow-Headers', 'X-Requested-With,x-access-token,content-type, Authorization')

    next()
})

//log all requests to the console using morgan
app.use(morgan('dev'))



//REGISTER ROUTES -------------------------------------------------------------
//apply the Admin routes to application
app.use('/admin', adminRoutes)
//apply the API routes to application
app.use('/api/v1', apiRoutes)

//MAIN CATCHALL ROUTE --------------------------------------------------------
//Send users to frontend if not on api route (must come after api route use)
app.get('*', function(req,res){
  console.log('Node app letting Angular app handle routing for this route')
	res.sendFile(path.join(__dirname + '/public/views/index.html'))
})

//start the server
app.listen(config.port);
console.log('Magic happens on port ' + config.port);
