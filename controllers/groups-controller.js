//require the group model to be used here
var Group = require('../models/group-model.js')

//create index action to display all groups
function index(req, res){
    Group.find({}, function(err, groups){
      if(err) console.log(err)
      res.json(groups)
    })
}

//method to create a group
function create(req, res){
  console.log('creating a group')
  //create a new instance of the group model
  var group = new Group()

  //set the groups information (comes from the request)
  group.groupName = req.body.groupName
  group.creator = req.body.creator
  group.members.push(req.body.members)



  //save the group and check for errors
  group.save(function(err){
    if(err){
      //duplicate entry
      if(err.code == 11000)
        return res.json({ success: false, message: 'A group with that groupname already exists'})
    }
  })
}

//Find and display one group
function show(req, res){
  Group.findById(req.params.group_id, function(err, group){
    if(err) res.send(err)
    //return group
    res.json(group)
  })
}

//Edit a group
function edit(req, res){
  Group.findById(req.params.group_id, function(err, group){
    if(err) res.send(err)
    //update info only if it's new
    if(req.body.groupName) group.groupName = req.body.groupName
    if (req.body.members) group.members = req.body.members
    if (req.body.resources) group.resources = req.body.resources
    //save the group
    group.save(function(err){
      if(err) res.send(err);
      //return a message
      res.json({message: "Group updated"})
    })
  })
}

//Delete a group
//Add verification that either admin or group creator can delete
function destroy(req, res){
  Group.remove({_id: req.params.group_id}, function(err, group){
    if(err) res.send(err);
    res.json({message:"Successfully deleted"})
  })
}

module.exports = {
  getAllGroups: index,
  createGroup: create,
  showGroup: show,
  editGroup: edit,
  deleteGroup: destroy
}
