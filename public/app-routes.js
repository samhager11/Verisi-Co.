(function(){
  angular.module('app.routes', ['ngRoute'])
    //configure our routes
    .config(['$routeProvider', '$locationProvider', pageRoutes])

    function pageRoutes($routeProvider, $locationProvider){
      $routeProvider
        //route for the home page
        .when('/', {
          templateUrl: 'views/partials/home.html',
          controller: 'homeController',
          controllerAs: 'homeCtrl'
        })
        .when('/login', {
          templateUrl: 'views/partials/login.html',
          controller: 'mainController',
          controllerAs: 'mainCtrl'
        })
        .when('/signup', {
          templateUrl: 'views/partials/signup.html',
          controller: 'mainController',
          controllerAs: 'mainCtrl'
        })
        .when('/search', {
          templateUrl: 'views/partials/search.html',
          controller: 'searchController',
          controllerAs: 'searchCtrl'
        })
        .when('/properties', {
          templateUrl: 'views/partials/properties.html',
          controller: 'propertiesController',
          controllerAs: 'propertiesCtrl'
        })
        .when('/properties/:propId', {
          templateUrl: 'partials/properties.html',
          controller: 'propertiesController',
          controllerAs: 'propertiesCtrl'
        })
        .when('/group', {
          templateUrl: 'views/partials/group.html',
          controller: 'groupController',
          controllerAs: 'groupCtrl'
        })
        .when('/communicate', {
          templateUrl: 'views/partials/communication.html',
          controller: 'communicationController',
          controllerAs: 'communicationCtrl'
        })
        .when('/users/:userId', {
          templateUrl: 'views/partials/edit-profile.html',
          controller: 'userController',
          controllerAs: 'userCtrl'
        })

        $locationProvider.html5Mode(true)
    }


}())
