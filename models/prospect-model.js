var mongoose = require('mongoose')


var prospectSchema = new mongoose.Schema({
    prospectName: {type:String},
    creator: {type:String, unique:true},
    strategy: {type:String},
    groupName: {type:String},
    zillowId: {},
    // rank: {sparse:true},
    zillowData: {},
    // zilpyData: {sparse:true},
    date: { type: Date, default: Date.now },
    // comments:[{body:String, date:{type:Date, default: Date.now}, sparse:true, username: String}]
    }
    // {strict:false}
  )

//return the model
var Prospect = mongoose.model('Prospect', prospectSchema )

module.exports = Prospect
