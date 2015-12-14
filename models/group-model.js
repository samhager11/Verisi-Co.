var mongoose = require('mongoose')


var groupSchema = new mongoose.Schema({
    groupName: {type: String, required:true, unique:true },
    creator: {type: String},
    members: [],
    resources: []//set properties in object from front-end controller function (username,category,date,id )
})

//return the model
var Group = mongoose.model('Group', groupSchema )

module.exports = Group
