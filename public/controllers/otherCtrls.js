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

      function searchController(searches, prospects, Auth){
        var self = this

        self.message = 'Checking the search controller'
        self.searchFactory = searches
        self.prospectFactory = prospects
        self.address = null
        self.cityStateZip = null
        self.prospects = []
        self.propObject = {}
        self.propName = null
        self.groupName = null
        self.user = null
        self.zpid = null

        self.search = function(address, cityStateZip){
          //Property Details Search
          self.searchFactory.runSearch(address,cityStateZip).success(function(response){
            var x2js = new X2JS();
            var zillowReturn  =  x2js.xml_str2json(response)
            self.zpid = zillowReturn.searchresults.response.results.result.zpid
            self.propObject.zillowSearch = zillowReturn.searchresults.response.results.result

            //If property found, get deep comps in api call to zillow
            self.searchFactory.getDeepComps(self.zpid).success(function(comps){
              var x2js = new X2JS();
              var zillowComps =  x2js.xml_str2json(comps)
              self.propObject.zillowComps = zillowComps.comps.response.properties
            })
            // self.searchFactory.getUpdatedDetails(self.zpid).success(function(details){
            //   var x2js = new X2JS();
            //   var zillowDetails =  x2js.xml_str2json(details)
            //   console.log(zillowDetails)
            //   // self.propObject.zillowDetails = zillowDetails.details.response
            //   // console.log("from details: " + self.propObject)
            // })
            //If property found, get chart in api call to zillow
            self.searchFactory.getChart(self.zpid).success(function(chart){
              var x2js = new X2JS();
              var zillowChart =  x2js.xml_str2json(chart)
              self.propObject.zillowChart = zillowChart.chart.response
            })

          })

        }

        self.saveProp = function(){
            // Auth.getUser().then(function(data){
            //   self.user = data.data
            // })
            // console.log(self.user)
            console.log('saving property....')
            var data = {prospectName: self.propName,
              strategy: self.strategy,
              groupName: self.groupName,
              zillowId: self.propObject.zillowSearch.zpid,
              zillowData: self.propObject
            }

            self.prospectFactory.addProspect(data).then(function(response){
              console.log('Saved property!')

            })

            self.propObject = {}
            self.propName = null
            self.strategy = null
            self.groupName = null
            self.address = null
            self.cityStateZip = null

          }
      }

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
