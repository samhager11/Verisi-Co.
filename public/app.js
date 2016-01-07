(function(){
  angular.module('verisiApp',['app.routes','mainCtrl','otherCtrls','otherServices','authService','ngMap'])
  //removed ngTouch from injections - not yet loaded

  //application configuration to integrate token into requests
  .config(function($httpProvider){
    //on every http request, the authInterceptor from authService.js method will be run
    $httpProvider.interceptors.push('AuthInterceptor')
  })

  // This filter makes the assumption that the input will be in decimal form (i.e. 17% is 0.17).
  .filter('percentage', ['$filter', function ($filter) {
      return function (input, decimals) {
        return $filter('number')(input * 100, decimals) + '%';
      };
    }]);

}())
