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

        self.api.listProspects().success(function(response){
            self.savedProspects.push(response)
            console.log(self.savedProspects)
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
