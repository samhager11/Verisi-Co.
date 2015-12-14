var mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs')

//user Schema
var userSchema = new mongoose.Schema({
    name: String,
    admin: {default:false, select: false}, //what else to make sure this cannot be modified from api request
    username: {type: String, required: true, unique:true },
    password: { type: String, required: true, select: false},
    email: {type: String},
    groups: []
})

//hash the password before the user is saved
userSchema.pre('save', function(next){
    var user = this
    //hash the password only in the password has been changed or user is new
    if(!user.isModified('password')) return next()

    //generate the salt
    bcrypt.hash(user.password, null, null, function(err, hash){
      if(err) return next(err)

      //change the password to the hashed version
      user.password = hash
      next()
    })
})

//method to compare a given password with the database hash
userSchema.methods.comparePassword = function(password){
    var user = this
    console.log(bcrypt.compareSync(password, user.password))
    return bcrypt.compareSync(password, user.password)
}

//create a User model using mongoose.model - 'User' must match database name in server.js
var User = mongoose.model('User', userSchema)

//export the model
module.exports = User
