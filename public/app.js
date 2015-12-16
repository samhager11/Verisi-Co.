(function(){
  angular.module('verisiApp',['app.routes','mainCtrl','otherCtrls','otherServices','authService'])

  //application configuration to integrate token into requests
  .config(function($httpProvider){
    //on every http request, the authInterceptor from authService.js method will be run
    $httpProvider.interceptors.push('AuthInterceptor')
  })

}())
