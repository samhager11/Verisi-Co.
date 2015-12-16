//require the user model to be used here
var Prospect = require('../models/prospect-model.js')


//create index action to display all prospects
function index(req, res){
    Prospect.find({}, function(err, prospects){
      if(err) console.log(err)
      res.json(prospects)
    })
}

//method to create a prospect
function create(req, res){
  console.log('creating a prospect')
  //create a new instance of the prospect model
  var prospect = new Prospect()

  //set the prospects information (comes from the request)
  prospect.prospectName = req.body.prospectName
  prospect.creator = req.body.creator
  prospect.strategy = req.body.strategy
  prospect.prospectName = req.body.prospectName
  prospect.address = req.body.address
  prospect.cityStateZip = req.body.cityStateZip
  prospect.zillowId = req.body.zillowId
  prospect.zillowData = req.body.zillowData
  prospect.zilpyData = req.body.zilpyData
  prospect.comments.push(req.body.newComment)



  //save the prospect and check for errors
  prospect.save(function(err){
    if(err){
      //duplicate entry
      if(err.code == 11000)
        return res.json({ success: false, message: 'A prospect with that prospectname already exists'})
    }
  })
}

//Find and display one prospect
function show(req, res){
  Prospect.findById(req.params.prospect_id, function(err, prospect){
    if(err) res.send(err)
    //return prospect
    res.json(prospect)
  })
}

//Edit a prospect
function edit(req, res){
  Prospect.findById(req.params.prospect_id, function(err, prospect){
    if(err) res.send(err)
    //update info only if it's new
    if(req.body.prospectName) prospect.prospectName = req.body.prospectName
    if(req.body.strategy) prospect.strategy = req.body.strategy
    if(req.body.groupName) prospect.groupName = req.body.groupName
    if(req.body.zillowId) prospect.zillowId = req.body.zillowId
    if(req.body.zillowData) prospect.zillowData = req.body.zillowData
    if(req.body.zilpyData) prospect.zilpyData = req.body.zilpyData
    if(req.body.comments) prospect.comments = req.body.comments
    //save the prospect
    prospect.save(function(err){
      if(err) res.send(err);
      //return a message
      res.json({message: "Prospect updated"})
    })
  })
}

//Delete a prospect
//add verification for delete
function destroy(req, res){
  Prospect.remove({_id: req.params.prospect_id}, function(err, prospect){
    if(err) res.send(err);
    res.json({message:"Successfully deleted"})
  })
}

module.exports = {
  getAllProspects: index,
  createProspect: create,
  showProspect: show,
  editProspect: edit,
  deleteProspect: destroy
}
