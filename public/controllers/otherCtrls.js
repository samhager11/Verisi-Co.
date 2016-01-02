(function(){
  angular.module('otherCtrls', ['otherServices','authService'])
      .controller('homeController', homeController)
      .controller('searchController', searchController)
      .controller('propertiesController', propertiesController)
      .controller('userController', userController)
      .controller('groupController', groupController)


      propertiesController.$inject = ['prospects']
      searchController.$inject = ['searches','prospects','Auth']


      function homeController(){
        var self = this
        self.heading = 'VERISI A HOME NOW'
      }

      function signupController(){
        var self = this
        self.message = 'Checking the signup controller'
      }

      //Controller for properties prior to saving and saving property
      //note use of prospectFactory in this function due to zillow api calls
      //being moved to server (api)
      function searchController(searches, prospects, Auth){
        var self = this

        self.message = 'Checking the search controller'
        self.searchFactory = searches
        self.prospectFactory = prospects
        // self.address = null
        // self.cityStateZip = null
        self.prospects = []
        self.propObject = null
        self.propName = null
        self.groupName = null
        self.user = null
        self.zpid = null

        self.search = function(){
          self.propObject = {}
          var data = {address: self.address,
                      cityStateZip: self.cityStateZip}
          //Save the response from our api to self.propObject then use save funciton
          //below to save (two different click events - Search and Save)

          //Run search on address and return object from zillow
          self.prospectFactory.searchProspect(data).success(function(response){
            var x2js = new X2JS();
            var zillowReturn  =  x2js.xml_str2json(response.zillowResult)
            self.zpid = zillowReturn.searchresults.response.results.result.zpid
            self.username = response.username
            self.propObject.zillowSearch = zillowReturn.searchresults.response.results.result
            var zpid = {zpid: self.zpid}

              //if property found via zillow then get deep comps, updated details and chart data
              self.prospectFactory.compsProspect(zpid).success(function(response){
                 var x2js = new X2JS();
                 var zillowComps =  x2js.xml_str2json(response)
                 self.propObject.zillowComps = zillowComps.comps.response.properties

              })

              self.prospectFactory.detailsProspect(zpid).success(function(response){
                  var x2js = new X2JS();
                  var zillowDetails =  x2js.xml_str2json(response.info)
                  self.propObject.zillowDetails = zillowDetails.updatedPropertyDetails.response
              })

            self.prospectFactory.chartProspect(zpid).success(function(response){
                  var x2js = new X2JS();
                  var zillowChart =  x2js.xml_str2json(response.info)
                  self.propObject.zillowChart = zillowChart.chart.response
            })

            console.log(self.propObject)

          })



          //   //If property found get updated details including pictures
          //   self.searchFactory.getUpdatedDetails(self.zpid).success(function(details){
          //     var x2js = new X2JS();
          //     var zillowDetails =  x2js.xml_str2json(details)
          //     console.log(zillowDetails)
          //     self.propObject.zillowDetails = zillowDetails.details.response
          //     console.log("checking updated details from search controller: " + self.propObject.zillowDetails)
          //   })
          //   // If property found, get chart in api call to zillow
          //   self.searchFactory.getChart(self.zpid).success(function(chart){
          //
          //   })
          //
          // })
          // address = null
          // cityStateZip = null
        }

        self.saveProp = function(){
            // Auth.getUser().then(function(data){
            //   self.user = data.data
            // })
            // console.log(self.user)
            console.log('saving property....')
            var data = {prospectName: self.propName,
              creator: self.username,
              strategy: self.strategy,
              groupName: self.groupName,
              zillowId: self.propObject.zillowSearch.zpid,
              zillowData: self.propObject
            }

            self.prospectFactory.addProspect(data).then(function(response){
              console.log('Saved property!')

            })

            self.propObject = null
            self.propName = null
            self.username = null
            self.strategy = null
            self.groupName = null
            self.address = null
            self.cityStateZip = null

          }
      }

      //Controller for properties once saved
      function propertiesController(prospects,$routeParams){
        var self = this
        self.savedProspects = []
        self.api = prospects
        self.groupCheck = []
        self.groupArrays = []
        self.property = null

        self.api.listProspects().success(function(response){
            self.savedProspects = response

            // push unique group names into array to use for reference
            for(var g=0; g<self.savedProspects.length; g++){
              if(self.groupCheck.indexOf(self.savedProspects[g].groupName)=== -1){
                self.groupCheck.push(self.savedProspects[g].groupName)
                self.groupArrays.push(self.savedProspects[g].groupName)
              }
            }
            // for each unique group name, create array of objects containing that group name
            for(i=0; i<self.groupCheck.length; i++){
              self.groupArrays[i] = []
              for(j=0; j<self.savedProspects.length; j++){
                if(self.savedProspects[j].groupName === self.groupCheck[i]){
                  self.groupArrays[i].push(self.savedProspects[j])
                }
              }
              // console.log(self.groupCheck)
              console.log(self.groupArrays)
            }

        })

        self.editing = false

        self.showProperty = function(propId){
          self.api.showProspect(propId).success(function(response){
            self.property = response
            console.log(response)
          })
        }

        self.deleteProperty = function(propId){
          self.api.removeProspect(propId).success(function(response){
            console.log(response)
            self.property = null
          })
        }

        self.editProperty = function(propId,data){
          var data = {groupName: self.property.newGroup, prospectName: self.property.newName, strategy: self.property.newStrategy}
          self.api.updateProspect(self.property._id, data).success(function(response){
            console.log('edit success')

            self.api.showProspect(self.property._id).success(function(response){
              self.property = response
              self.editing = false
              console.log(response)
            })
          })
        }



      //   // retrieve a car based on the url parameter for carId, then set this controller's 'car' property to the response to show it on the front-end
      //   self.showCar = function(carId){
      //       self.api.show(carId).success(function(response){
      //         self.car = response
      //       })
      //     }
      //     self.showCar($routeParams.carId)
      //
    }

      function resourcesController(){
        var self = this
        self.message = 'Checking the resources controller'
      }

      function userController(){
        var self = this
      }

      function groupController(){
        var self = this
      }


}())
