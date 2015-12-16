
  // create angular module for auth service
  angular.module('authService', [])
  // create a function to export for your service

  .factory('Auth', Auth)
  .factory('AuthToken', AuthToken)
  .factory('AuthInterceptor', AuthInterceptor)

  Auth.$inject = ['$http','$q','AuthToken']
  AuthToken.$inject = ['$window']
  AuthInterceptor.$inject = ['$q', 'AuthToken']

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
