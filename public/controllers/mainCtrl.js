(function(){

  angular.module('mainCtrl', [])
    .controller('mainController', mainController)

  mainController.$inject = ['$rootScope', '$location', 'Auth']

  function mainController($rootScope, $location, Auth){
    var self = this
    //get info if person is logged in
    self.loggedIn = Auth.isLoggedIn()
    //check to see if a user is logged in on every request
    $rootScope.$on('$routeChangeStart', function(){
      self.loggedIn = Auth.isLoggedIn()
      //get user information on page load
      Auth.getUser()
        .then(function(data){
          self.user = data.data
        })
    })

    //function to handle login form
    self.doLogin = function(){
      //call the Auth.login() function
      Auth.login(self.loginData.username, self.loginData.password)
        .success(function(data){
          //get user information after logging in
          Auth.getUser()
            .success(function(data){
              self.user = data
              console.log(self.user.name + " logging from doLogin() function in mainCtrl")
            })
            //if user successfully logs in, redirect to search landing page
            $location.path('/search')
        })
    }
    //function to handle logging out
    self.doLogout = function(){
      Auth.logout()
      $location.path('/')
    }
  }

}())
