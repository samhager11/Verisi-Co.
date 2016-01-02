var express = require('express'),
  apiRoutes = express.Router(),
  usersController = require('../controllers/users-controller.js'),
  User = require('../models/user-model.js')
  groupsController = require('../controllers/groups-controller.js'),
  prospectsController = require('../controllers/prospects-controller.js'),
  jwt = require('jsonwebtoken'),
  config = require('../configuration/config.js'),
  superSecret = config.secret


//JWT AUTHENTICATION -------------------------------------------------------
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
                superSecret,
                {expiresIn: 86400}) //expires in 24 hours(expressed in seconds = 24*60*60)
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

//API MIDDLEWARE -----------------------------------------------------------
//route middleware to verify a token
apiRoutes.use(function(req, res, next){
  //check header or url parameters or post parameters for token
  var token = req.body.token || req.param('token') || req.headers['x-access-token']
  //decode token
  if(token){
    //verifies secret and checks exp(iration)
    //secret must match the secret that was used to create the token
    jwt.verify(token, superSecret, function(err, decoded){
      if(err){
        return res.status(403).send({success: false, message: 'Failed to authenticate token.'})
      } else {
        //if everything checks out, save token to request object for use in other routes (passed to others)
        req.decoded = decoded
        next()
      }
    })
  } else {
    //if there is no token return HTTP response of 403(access forbidden) and an error message
    return res.status(403).send({success: false, message: 'No token provided.'})
  }
  //next() used to be here
})



//Api route /api/v1
apiRoutes.get('/', function(req, res){
    res.json({ message: 'we made it to the api'})
})

//Check what info is being sent in the request(token)
apiRoutes.get('/me', function(req, res){
  res.send(req.decoded)
})


//USER ROUTES---------------------------------------------------------------
apiRoutes.route('/users')
  .get(usersController.getAllUsers)
  .post(usersController.createUser)

apiRoutes.route('/users/:user_id')
  .get(usersController.showUser)
  .put(usersController.editUser)
  .delete(usersController.deleteUser)


//GROUP ROUTES---------------------------------------------------------------
apiRoutes.route('/groups')
  .get(groupsController.getAllGroups)
  .post(groupsController.createGroup)

apiRoutes.route('/groups/:group_id')
  .get(groupsController.showGroup)
  .put(groupsController.editGroup)
  .delete(groupsController.deleteGroup)

//PROSPECT ROUTES--------------------------------------------------------------
apiRoutes.route('/prospects')
  .get(prospectsController.getAllProspects)
  .post(prospectsController.createProspect)

apiRoutes.route('/prospects/search')
  .post(prospectsController.searchProspect)

apiRoutes.route('/prospects/comps')
  .post(prospectsController.compsProspect)

apiRoutes.route('/prospects/details')
  .post(prospectsController.detailsProspect)

apiRoutes.route('/prospects/chart')
  .post(prospectsController.chartProspect)

apiRoutes.route('/prospects/:prospect_id')
  .get(prospectsController.showProspect)
  .put(prospectsController.editProspect)
  .delete(prospectsController.deleteProspect)




module.exports = apiRoutes
