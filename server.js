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
    port = process.env.PORT || 8080,
    jwt = require('jsonwebtoken'),
    superSecret = 'thoughttherockieswouldberockier'


//APP CONFIGURATION ----------------------------------------------------------

//establishes connection to mongo database(that can be anywhere)
mongoose.connect('mongodb://samhager11:password@ds027335.mongolab.com:27335/project4')

//route for authenticating users
//check to make sure user with that username exists
//check correct password
//create a token
apiRoutes.post('/authenticate', function(req,res){
  //find the user - select the username and password explicitly
  User.findOne({username:req.body.username})
    .select('name username password')
    .exec(function(err, user){
      if(err) throw console.error();
      //no user with that username found
      if(!user){
        res.json({success: false, message: 'Authentication failed, user not found.'})
      } else if(user){
          //check if password matches - comparePassword method created for userSchema in user-model.js
          var validPassword = user.comparePassword(req.body.password)
          if(!validPassword){
              res.json({success: false, message: 'Authentication faild. Wrong password.'})
          } else {
              //if user found and password correct create a token
              var token = jwt.sign({
                name: user.name,
                username: user.username},
                superSecret, {
                  expiresInMinutes: 1440 //expires in 24 hours
                })
                //return the information including the token as JSON
                res.json({
                  success: true,
                  message: 'Enjoy your token boss',
                  token: token
                })
            }
          }
      })
  })

//use body parser to grab information from POST requests
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


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
app.get('/', function(req, res){
    res.sendfile(__dirname + '/home.html')
})

//REGISTER ROUTES -------------------------------------------------------------
//apply the Admin routes to application
app.use('/admin', adminRoutes)
//apply the API routes to application
app.use('/api/v1', apiRoutes)


//start the server
app.listen(port);
console.log('Magic happens on port ' + port);
