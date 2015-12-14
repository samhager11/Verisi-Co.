//require the user model to be used here
var User = require('../models/user-model.js')


//create index action to display all users
function index(req, res){
    User.find({}, function(err, users){
      if(err) console.log(err)
      res.json(users)
    })
}

//method to create a user
function create(req, res){
  console.log('creating a user')
  //create a new instance of the User model
  var user = new User()

  //set the users information (comes from the request)
  user.name = req.body.name
  user.username = req.body.username
  user.password = req.body.password
  user.email = req.body.email
  user.groups.push(req.body.groups)

  //save the user and check for errors
  user.save(function(err){
    if(err){
      //duplicate entry
      if(err.code == 11000)
        return res.json({ success: false, message: 'A user with that username already exists'})
    }
  })
}

//Find and display one user
function show(req, res){
  User.findById(req.params.user_id, function(err, user){
    if(err) res.send(err)
    //return user
    res.json(user)
  })
}

//Edit a user
function edit(req, res){
  User.findById(req.params.user_id, function(err, user){
    if(err) res.send(err)
    //update info only if it's new
    if(req.body.name) user.name = req.body.name
    if(req.body.username) user.username = req.body.username
    if (req.body.password) user.password = req.body.password
    if (req.body.email) user.email = req.body.email
    if (req.body.groups) user.groups = req.body.groups
    //save the user
    user.save(function(err){
      if(err) res.send(err);
      //return a message
      res.json({message: "User updated"})
    })
  })
}

//Delete a user
function destroy(req, res){
  User.remove({_id: req.params.user_id}, function(err, user){
    if(err) res.send(err);
    res.json({message:"Successfully deleted"})
  })
}


module.exports = {
  getAllUsers: index,
  createUser: create,
  showUser: show,
  editUser: edit,
  deleteUser: destroy
}
