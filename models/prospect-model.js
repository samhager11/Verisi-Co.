var mongoose = require('mongoose')


var prospectSchema = new mongoose.Schema({
    prospectName: {type:String},
    admin: {type:String},
    strategy: {type:String},
    groupName: {type:String},
    zillowId: {type: String, required:true, unique:true },
    zillowData: {},
    zilpyData: {},
    date: { type: Date, default: Date.now },
    comments:[{body:String, date:{type:Date, default: Date.now}, username: String}]
})

//return the model
var Prospect = mongoose.model('Prospect', prospectSchema )

module.exports = Prospect