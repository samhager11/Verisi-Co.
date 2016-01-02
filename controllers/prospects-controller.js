//require the user model to be used here
var Prospect = require('../models/prospect-model.js'),
    request = require('request')
    // x2js = require('../public/libs/xml2json/xml2json.js')



//create index action to display all prospects
function index(req, res){
    Prospect.find({}, function(err, prospects){
      if(err) console.log(err)
      res.json(prospects)
    })
}

function search(req, res){

  var searchObject = {}
  var apiKey = "X1-ZWz1f1owqx0utn_70ucn"
  var zillowSearchBase = "http://www.zillow.com/webservice/GetSearchResults.htm?zws-id=" + apiKey

  var address = null
  var cityStateZip = null

  address = req.body.address
  cityStateZip = req.body.cityStateZip

  var zillowSearchUrl = zillowSearchBase + "&address=" + address + "&citystatezip="+ cityStateZip

  request(zillowSearchUrl, function(error, response, body){
    if(error){
      console.log(error)
    } else {
      searchObject = {zillowResult: body, username: req.decoded.username}
      res.json(searchObject)
    }

  })

}

function comps(req, res){

  var apiKey = "X1-ZWz1f1owqx0utn_70ucn"
  var zillowDeepCompsBase = "http://www.zillow.com/webservice/GetDeepComps.htm?zws-id=" + apiKey

  var zpid = null

  zpid = req.body.zpid

  var zillowDeepCompsUrl = zillowDeepCompsBase + "&zpid=" + zpid + "&count=10"

  request(zillowDeepCompsUrl, function(error, response, body){
    if(error){
      console.log(error)
    } else {
      res.json(body)
    }

  })
}

function details(req, res){
  console.log("hitting details api endpoint")

  var apiKey = "X1-ZWz1f1owqx0utn_70ucn"
  var zillowUpdatedDetails = "http://www.zillow.com/webservice/GetUpdatedPropertyDetails.htm?zws-id=" + apiKey


  var zpid = null

  zpid = req.body.zpid
console.log(req.body)

  var zillowUpdatedDetailsUrl = zillowUpdatedDetails + "&zpid=" + zpid

  request(zillowUpdatedDetailsUrl, function(error, response, body){
    if(error){
      console.log(error)
    } else if(!response){
      res.json({info: "No details available"})
    }  else {
      console.log(response)
      res.json({info: body})
    }

  })
}

function chart(req, res){
  console.log("hitting details api endpoint")

  var apiKey = "X1-ZWz1f1owqx0utn_70ucn"
  var zillowChart = "http://www.zillow.com/webservice/GetChart.htm?zws-id=" + apiKey

  var zpid = null

  zpid = req.body.zpid
  console.log(req)

  var zillowChartUrl = zillowChart + "&unit-type=dollar&zpid=" + zpid + "&width=400&height=200&chartDuration=10years"

  request(zillowChartUrl, function(error, response, body){
    if(error){
      console.log(error)
    } else if(!response){
      res.json({info: "No chart available"})
    }  else {
      console.log(response)
      res.json({info: body})
    }

  })
}



//method to save a prospect (have to run search to display item first)
function create(req, res){
  console.log('creating a prospect')
  //create a new instance of the prospect model
  var prospect = new Prospect()

  //set the prospects information (comes from the request)
  prospect.prospectName = req.body.prospectName
  prospect.groupName = req.body.groupName
  prospect.creator = req.body.creator
  prospect.strategy = req.body.strategy
  prospect.zillowId = req.body.zillowId
  // prospect.rank = req.body.rank
  prospect.zillowData = req.body.zillowData
  prospect.zilpyData = req.body.zilpyData
  // prospect.comments.push(req.body.newComment)



  //save the prospect and check for errors
  prospect.save(function(err){
    if(err){
      console.log(err)
      //duplicate entry
      // if(err.code == 11000)
        // return res.json({ success: false, message: 'A prospect with that prospectname already exists'})
        return err
    }
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
    if(req.body.rank) prospect.rank = req.body.rank
    if(req.body.zillowData) prospect.zillowData = req.body.zillowData
    if(req.body.zilpyData) prospect.zilpyData = req.body.zilpyData
    if(req.body.comments) prospect.comments.push(req.body.comments)
    //save the prospect
    prospect.save(function(err){
      if(err) res.send(err);
      //return a message
      res.json({message: "Prospect updated"})
    })
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
  deleteProspect: destroy,
  searchProspect: search,
  compsProspect: comps,
  detailsProspect: details,
  chartProspect: chart
}
