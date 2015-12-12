//get an instance of the router
var express = require('express'),
    adminRouter = express.Router();

//route middleware that will happen on every request
//this is doing what morgan does
adminRouter.use(function(req,res,next){
    // log each request to the console
    console.log(req.method, req.url);
    //continue doing what we were doing and go to the route
    next();
})

//more middleware for a particular route to validate :username
adminRouter.param('username', function(req, res, next, username){
  //do validation on username here

  //log something so we know its working
  console.log('doing name validations on ' + username)
  //once validation is done save the new item in the req
  req.username = username;
  //go to the next thing
  next();
})

//admin main page, the dashboard(http://localhost:1337/admin)
adminRouter.get('/', function(req,res){
    res.send('I am the dashboard!')
})

//users page (http://localhost:1337/admin/users)
adminRouter.get('/users', function(req,res){
    res.send('I show all the users!')
})

//posts page (http://localhost:1337/admin/users)
adminRouter.get('/posts', function(req,res){
    res.send('I show all the posts')
})

//route with parameters (http://localhost:1337/admin/users/:username)
adminRouter.get('/users/:username', function(req,res){
  res.send('hello ' + req.params.username)
})

module.exports = adminRouter
