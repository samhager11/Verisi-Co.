(function(){
  angular.module('verisiApp')
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
    function searchController(){
      var self = this
      self.message = 'Checking the search controller'
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
