(function(){
  angular.module('verisiApp')
    //configure our routes
    .config(['$routeProvider', '$locationProvider', pageRoutes])

    function pageRoutes($routeProvider, $locationProvider){
      $routeProvider
        //route for the home page
        .when('/', {
          templateUrl: 'partials/home.html',
          controller: 'homeController',
          controllerAs: 'homeCtrl'
        })
        .when('/login', {
          templateUrl: 'partials/login.html',
          controller: 'loginController',
          controllerAs: 'loginCtrl'
        })
        .when('/signup', {
          templateUrl: 'partials/signup.html',
          controller: 'signupController',
          controllerAs: 'signupCtrl'
        })
        .when('/search', {
          templateUrl: 'partials/search.html',
          controller: 'searchController',
          controllerAs: 'searchCtrl'
        })
        .when('/collections', {
          templateUrl: 'partials/collections.html',
          controller: 'collectionsController',
          controllerAs: 'collectionsCtrl'
        })
        .when('/comparables', {
          templateUrl: 'partials/comparables.html',
          controller: 'comparablesController',
          controllerAs: 'comparablesCtrl'
        })
        .when('/group', {
          templateUrl: 'partials/group.html',
          controller: 'groupController',
          controllerAs: 'groupCtrl'
        })
        .when('/resources', {
          templateUrl: 'partials/resources.html',
          controller: 'resourcesController',
          controllerAs: 'resourcesCtrl'
        })
        .when('/users/:userId', {
          templateUrl: 'partials/edit-profile.html',
          controller: 'userController',
          controllerAs: 'userCtrl'
        })

        $locationProvider.html5Mode(true)
    }


}())
