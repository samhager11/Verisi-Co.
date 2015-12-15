(function(){
  angular.module('verisiApp')
    .factory('users', users)
    .factory('groups', groups)
    .factory('propsects', prospects)
    .factory('searches', searches)
    .factory('Auth', Auth)
    .factory('AuthToken' AuthToken)
    .factory('AuthInterceptor', AuthInterceptor)

    users.$inject = [$http]
    groups.$inject = [$http]
    prospects.$inject = [$http]
    searches.$inject = [$http]
    Auth.$inject = [$http,$q]
    AuthToken.$inject = [$window]
    AuthInterceptor.$inject = [$q]

//=============================================================================
//Auth factory to login to get information
//inject $http for communicating with API
//inject $q to return promise objects
//inject AuthToken (function created below) to manage tokens
  function Auth($http,$q,AuthToken){
      //auth factory object
      var authFactory = {}

      //handle login
      authFactory.login = function(username, password){
        return $http.post('/api/v1/authenticate', {
          username: username,
          password: password
        })
          .success(function(data){
            AuthToken.setToken(data.token)
            return data
          })
      }

      //handle logout
      authFactory.logout = function(){
        //clear the token
        AuthToken.setToken();
      }

      //check if a user is logged in and if there is a local token stored
      authFactory.isLoggedIn = function(){
        if(AuthToken.getToken()){
          return true
        }
        else {
            return false
        }
      }

      //get the logged in user info
      authFactory.getUser = function(){
        if (AuthToken.getToken()){
          return $http.get('/api/v1/me')
        }
        else {
          return $q.reject({message: 'User has no token.'})
        }
      }

      //return auth factory object
      return authFactory
    }

//=============================================================================
//factory for handling tokens
//inject $window to store token client-side
  function AuthToken($window){
    var authTokenFactory = {}

    //get the token out of local storage
    authTokenFactory.getToken = function(){
      return $window.localStorage.getItem('token')
    }

    //set the token or clear the token
    authTokenFactory.setToken = function(token){
      if(token)
        $window.localStorage.setItem('token', token)
      else {
        $window.localStorage.removeItem('token')
      }
    }

    return authTokenFactory
  }

//==============================================================================
//application configuration to integrate token into requests
  function AuthInterceptor($q,AuthToken){
    var interceptorFactory = {}

    //attach the token to every HTTP request
    interceptorFactory.request = function(config){
      //grab the token
      var token = AuthToken.getToken()
      //if token exists, add it to the head as x-access-token
      if(token){
        config.headers['x-access-token'] = token
      }
      return config
    }
    //redirect if a token doesn't authenticate and response error received
    interceptorFactory.responseError = function(response){
      //if our server returns a 403 forbidden response
      if(response.status === 403){
        $location.path('/login')
      }
      //return the errors from the server as a promise
      return $q.reject(response)
    }

    return interceptorFactory
  }

//=============================================================================
//HTTP Requests to our backend API

    //create users function for requests to backend api
    function users($http){
      var usersUrl = 'api/v1/users'
      var users = {}

      users.listUsers = function(){
        return $http.get(usersUrl)
      }

      users.showUser = function(userId){
        return $http.get(usersUrl + '/' + userId )
      }

      users.addUser = function(data){
        return $http.post(usersUrl, data)
      }

      users.updateUser = function(userId, data){
        return $http.put(usersUrl + '/' + userId, data)
      }

      users.removeUser =function(userId){
        return $http.delete(usersUrl + '/' + userId)
      }

      return users

    }

    function groups($http){
      var groupsUrl = 'api/v1/groups'
      var groups = {}

      groups.listGroups = function(){
        return $http.get(groupsUrl)
      }

      groups.showGroup = function(groupId){
        return $http.get(groupsUrl + '/' + groupId )
      }

      groups.addGroup = function(data){
        return $http.post(groupsUrl, data)
      }

      groups.updateGroup = function(groupId, data){
        return $http.put(groupsUrl + '/' + groupId, data)
      }

      groups.removeGroup =function(groupId){
        return $http.delete(groupsUrl + '/' + groupId)
      }

      return groups

    }

    function prospects($http){
      var prospectsUrl = 'api/v1/prospects'
      var prospectFactory = {}

      prospects.listProspects = function(){
        return $http.get(prospectsUrl)
      }

      prospects.showProspect = function(prospectId){
        return $http.get(prospectsUrl + '/' + prospectId )
      }

      prospects.addProspect = function(data){
        return $http.post(prospectsUrl, data)
      }

      prospects.updateProspect = function(prospectId, data){
        return $http.put(prospectsUrl + '/' + prospectId, data)
      }

      prospects.removeProspect =function(prospectId){
        return $http.delete(prospectsUrl + '/' + prospectId)
      }

      return prospects

    }

    function searches($http){

      var searches = {}

      searches.runSearch = function(searchTerm){

      }

    }




}())
