(function(){
  angular.module('otherServices', [])
    .factory('users', users)
    .factory('groups', groups)
    .factory('propsects', prospects)
    .factory('searches', searches)


    users.$inject = ['$http']
    groups.$inject = ['$http']
    prospects.$inject = ['$http']
    searches.$inject = ['$http']


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
      var apiKey = "X1-ZWz1f1owqx0utn_70ucn"
      var zillowUrlBase = "http://www.zillow.com/webservice/GetSearchResults.htm?zws-id=" + apiKey
      searches = {}
      var prospectsUrl = 'api/v1/prospects'

      searches.runSearch = function(address,cityStateZip){
        zillowUrl = zillowUrlBase + "&address=" + address + "&citystatezip="+ cityStateZip
        console.log("Zillow Url from factory: " + zillowUrl)
        // var request = {
        //   method: 'GET',
        //   url: zillowUrl,
        //   headers: {
        //
        //   }
        // }

        return $http.get(zillowUrl)
        //
        // // Create the XHR object.
        // function createCORSRequest(method, url) {
        //   var xhr = new XMLHttpRequest();
        //   if ("withCredentials" in xhr) {
        //     // XHR for Chrome/Firefox/Opera/Safari.
        //     xhr.open(method, url, true);
        //   } else if (typeof XDomainRequest != "undefined") {
        //     // XDomainRequest for IE.
        //     xhr = new XDomainRequest();
        //     xhr.open(method, url);
        //   } else {
        //     // CORS not supported.
        //     xhr = null;
        //   }
        //   return xhr;
        // }
        //
        // // Helper method to parse the title tag from the response.
        // function getTitle(text) {
        //   return text.match('<title>(.*)?</title>')[1];
        // }
        //
        // // Make the actual CORS request.
        // function makeCorsRequest() {
        //   // All HTML5 Rocks properties support CORS.
        //   var url = 'http://updates.html5rocks.com';
        //
        //   var xhr = createCORSRequest('GET', url);
        //   if (!xhr) {
        //     alert('CORS not supported');
        //     return;
        //   }
        //
        //   // Response handlers.
        //   xhr.onload = function() {
        //     var text = xhr.responseText;
        //     var title = getTitle(text);
        //     alert('Response from CORS request to ' + url + ': ' + title);
        //   };
        //
        //   xhr.onerror = function() {
        //     alert('Woops, there was an error making the request.');
        //   };
        //
        //   xhr.send();
        // }

      }

      return searches
    }




}())
