(function(){
  angular.module('otherCtrls', ['otherServices'])
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

      searchController.$inject = ['searches']


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

      function searchController(searches){
        var self = this

        self.message = 'Checking the search controller'
        self.api = searches
        self.address = null
        self.cityStateZip = null
        self.prospect = {}

        self.search = function(address, cityStateZip){
          self.api.runSearch(address,cityStateZip).success(function(response){
            // console.log(response)
            var x2js = new X2JS();
            var zillowReturn  =  x2js.xml_str2json(response)
            self.prospect = zillowReturn.searchresults.response.results.result
            console.log(self.prospect)

          })
        }
      }

      function collectionsController(){
        var self = this
        self.message = 'Checking the collections controller'
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
