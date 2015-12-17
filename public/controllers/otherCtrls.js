(function(){
  angular.module('otherCtrls', ['otherServices','authService'])
      .controller('homeController', homeController)
      .controller('loginController', loginController)
      .controller('signupController', signupController)
      .controller('searchController', searchController)
      .controller('collectionsController', collectionsController)
      .controller('comparablesController', comparablesController)
      .controller('resourcesController', resourcesController)
      .controller('userController', userController)
      .controller('groupController', groupController)
      .controller('prospectController', prospectController)

      collectionsController.$inject = ['prospects']
      searchController.$inject = ['searches','prospects','Auth']


      function homeController(){
        var self = this
        self.heading = 'VERISI A HOME NOW'
      }

      function loginController(){
        var self = this
        self.message = 'Checking the login controller'
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
        self.propObject = null
        self.propName = null
        self.groupName = null
        self.user = null

        self.search = function(address, cityStateZip){
          self.searchFactory.runSearch(address,cityStateZip).success(function(response){
            // console.log(response)
            var x2js = new X2JS();
            var zillowReturn  =  x2js.xml_str2json(response)
            var zillowId = zillowReturn.searchresults.response.results.result.zpid
            self.propObject = zillowReturn.searchresults.response.results.result
            console.log(self.propObject)

          })
        }

        self.saveProp = function(){
            // Auth.getUser().then(function(data){
            //   self.user = data.data
            // })
            // console.log(self.user)
            console.log('saving property....')
            var data = {prospectName: self.prospectName,
              strategy: self.strategy,
              groupName: self.groupName,
              zillowId: self.propObject.zpid,
              zillowData: self.propObject
            }

            self.prospectFactory.addProspect(data).then(function(response){
              console.log('Saved property!')

            })

            self.propObject = null
            self.propName = null
            self.strategy = null
            self.groupName = null
            self.address = null
            self.cityStateZip = null

          }
      }

      function collectionsController(prospects){
        var self = this
        self.savedProspects = []
        self.api = prospects
        self.groupCheck = []
        self.groupArrays = []

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
              console.log(self.groupCheck)
              console.log(self.groupArrays)
            }

        })


      }

      function comparablesController(){
        var self = this
        self.message = 'Checking the comparables controller'
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

      function prospectController(){
        var self = this
      }

}())
