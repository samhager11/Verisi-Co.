var express = require('express'),
    app = express(),
    adminRoutes = require('./routes/admin-router.js'),
    apiRoutes = require('./routes/api-router.js')
    mongoose = require('mongoose')

//establishes connection to mongo database(that can be anywhere)
mongoose.connect('mongodb://localhost/users')

//send our index.html file to the user for the home page
app.get('/', function(req, res){
    res.sendfile(__dirname + '/index.html')
})

//apply the Admin routes to our application
app.use('/admin', adminRoutes)
//apply the API routes to our application
app.use('/api/v1', apiRoutes)

//shortcut to the Router to define mutliple requests on a route
app.route('/login')
    //show the form(GET http://localhost:1337/login)
    .get(function(req,res){
      res.send('this is the login form')
    })
    //process the form (POST http://localhost:1337/login)
    .post(function(req,res){
      console.log('processing');
      res.send('processing the login form')
    })

//start the server
app.listen(1337);
console.log('1337 is the magic port');
