(function(){
  angular.module('otherCtrls', ['otherServices','authService','ngMap'])
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
      function propertiesController(prospects,$routeParams,NgMap){
        var self = this
        self.savedProspects = []
        self.api = prospects
        self.groupCheck = []
        self.groupArrays = []
        self.property = null
        self.compareProps = []
        self.compareName = "Choose Comparable"
        self.compareThis = null


        self.api.listProspects().success(function(response){

            self.savedProspects = response
            // push unique group names into array to use for reference
            for(var g=0; g<self.savedProspects.length; g++){
              if(self.groupCheck.indexOf(self.savedProspects[g].groupName)=== -1){
                self.groupCheck.push(self.savedProspects[g].groupName)
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
            console.log(self.compareThis)
            self.property = response
            self.compareProps = []
            console.log(response)
            for (var i = 0; i < self.groupArrays.length; i++) {
              for (var j = 0; j < self.groupArrays[i].length; j++) {
                if(self.property.groupName === self.groupArrays[i][j].groupName && self.property.prospectName !== self.groupArrays[i][j].prospectName){
                  self.compareProps.push(self.groupArrays[i][j])
                }
              }
            }

            self.mapOptions = {
              // center: new google.maps.LatLng(Number(self.property.zillowData.zillowSearch.address.latitude), Number(self.property.zillowData.zillowSearch.address.longitude)),
              zoom: 9,
              // mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            self.map = new google.maps.Map(document.getElementById("map-properties"),self.mapOptions);
            self.markerCoords = {lat: Number(self.property.zillowData.zillowSearch.address.latitude), lng: Number(self.property.zillowData.zillowSearch.address.longitude) }

            google.maps.event.addListenerOnce(self.map, 'idle', function() {
               google.maps.event.trigger(self.map, 'resize')

               self.map.setCenter(new google.maps.LatLng(Number(self.property.zillowData.zillowSearch.address.latitude), Number(self.property.zillowData.zillowSearch.address.longitude)));

               var mainMarker= {
                      url: '../images/map-marker-red-fat.png',
                      size: new google.maps.Size(71, 71),
                      origin: new google.maps.Point(0,0),
                      anchor: new google.maps.Point(0, 34),
                      scaledSize: new google.maps.Size(35,42)
                    }
              var groupPropMarker = {
                     url: '../images/map-marker-black.png',
                     size: new google.maps.Size(71, 71),
                     origin: new google.maps.Point(0,0),
                     anchor: new google.maps.Point(0, 34),
                     scaledSize: new google.maps.Size(32,30)
                   }

              var compMarker = {
                     url: '../images/map-marker-comp.png',
                     size: new google.maps.Size(71, 71),
                     origin: new google.maps.Point(0,0),
                     anchor: new google.maps.Point(0, 34),
                     scaledSize: new google.maps.Size(25,20)
                   }

               self.marker = new google.maps.Marker({
                 position: self.markerCoords,
                 map: self.map,
                 title: self.property.prospectName,
                 icon: mainMarker
               });

               for (var i = 0; i < self.compareProps.length; ++i) {
                 var compareCoords = {lat: Number(self.compareProps[i].zillowData.zillowSearch.address.latitude), lng: Number(self.compareProps[i].zillowData.zillowSearch.address.longitude)}
                  self.compMarker = new google.maps.Marker({
                    position: compareCoords,
                    map: self.map,
                    title: self.compareProps[i].prospectName,
                    icon: groupPropMarker
                  });
                }



               console.log("google maps resize")
             });


          })
        }



        //If a property is chosen to compare, set compare object
        self.compareProperty = function(compareName){
          self.compareName = compareName
          if(compareName !== "Choose Comparable" && compareName !== "--Clear--"){
            console.log("comparing running")
            console.log(compareName)
            for (var i = 0; i < self.compareProps.length; i++) {
              if(self.compareProps[i].prospectName === self.compareName){
                //set self.compareThis object to the property matching the input in the dropdown on property details page
                //Then compare this object to the selected property for each data point below
                self.compareThis = self.compareProps[i]

                //compare zestimate values
                self.compareThis.zestimateValue = self.property.zillowData.zillowComps.principal.zestimate.amount.__text - self.compareThis.zillowData.zillowComps.principal.zestimate.amount.__text
                self.compareThis.zestimatePercentage = self.compareThis.zestimateValue /self.property.zillowData.zillowComps.principal.zestimate.amount.__text

                //compare square footage
                self.compareThis.feetValue = self.property.zillowData.zillowComps.principal.finishedSqFt - self.compareThis.zillowData.zillowComps.principal.finishedSqFt
                self.compareThis.feetPercentage = self.compareThis.feetValue / self.property.zillowData.zillowComps.principal.finishedSqFt

                //compare square footage price
                self.compareThis.footPriceValue = (self.property.zillowData.zillowComps.principal.zestimate.amount.__text / self.property.zillowData.zillowComps.principal.finishedSqFt) - (self.compareThis.zillowData.zillowComps.principal.zestimate.amount.__text / self.property.zillowData.zillowComps.principal.finishedSqFt)
                self.compareThis.footPricePercentage = self.compareThis.footPriceValue / (self.property.zillowData.zillowComps.principal.zestimate.amount.__text / self.property.zillowData.zillowComps.principal.finishedSqFt)

                //compare number of bedrooms - not using percentage as doesn't make sense for bedrooms
                self.compareThis.bedsValue = self.property.zillowData.zillowComps.principal.bedrooms - self.compareThis.zillowData.zillowComps.principal.bedrooms
                // self.compareThis.bedsPercentage = self.compareThis.bedsValue / self.property.zillowData.zillowComps.principal.bedrooms

                //compare number of bathrooms
                self.compareThis.bathroomsValue = self.property.zillowData.zillowComps.principal.bathrooms - self.compareThis.zillowData.zillowComps.principal.bathrooms
                // self.compareThis.bathroomsPercentage = (self.property.zillowData.zillowComps.principal.bathrooms - self.compareThis.zillowData.zillowComps.principal.bathrooms)/self.property.zillowData.zillowComps.principal.bathrooms

                //compare price per bedroom
                self.compareThis.bedroomPriceValue = (self.property.zillowData.zillowComps.principal.zestimate.amount.__text / self.property.zillowData.zillowComps.principal.bedrooms) - (self.compareThis.zillowData.zillowComps.principal.zestimate.amount.__text / self.property.zillowData.zillowComps.principal.bedrooms)
                self.compareThis.bedroomPricePercentage = self.compareThis.bedroomPriceValue / (self.property.zillowData.zillowComps.principal.zestimate.amount.__text / self.property.zillowData.zillowComps.principal.bedrooms)

                //dates comparison not used as doesn't make sense
                // self.compareThis.lastSoldDate = self.property.zillowData.zillowComps.principal.lastSoldDate - self.compareThis.zillowData.zillowComps.principal.lastSoldDate

                //compare last sold Price
                self.compareThis.lastSoldValue = self.property.zillowData.zillowComps.principal.lastSoldPrice.__text - self.compareThis.zillowData.zillowComps.principal.lastSoldPrice.__text
                self.compareThis.lastSoldPercentage = self.compareThis.lastSoldValue /self.property.zillowData.zillowComps.principal.lastSoldPrice.__text
              }
            }
          } else {
            self.compareThis = null
          }
        }


        self.deleteProperty = function(propId){
          self.api.removeProspect(propId).success(function(response){
            console.log(response)
            self.property = null
            self.compareProps = null
            //Run listProspects() to update list of available properties
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

            //Run listProspects() to update list of available properties
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
          })
        }
    }

      function communicationController(){
        var self = this
        self.message = 'Checking the communication controller'
      }

      function userController(){
        var self = this
      }

      function groupController(){
        var self = this
      }


}())
