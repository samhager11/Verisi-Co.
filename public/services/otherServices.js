(function(){
  angular.module('otherServices', [])
    .factory('users', users)
    .factory('groups', groups)
    .factory('prospects', prospects)
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
        console.log('removing prospect from factory')
        return $http.delete(prospectsUrl + '/' + prospectId)
      }

      return prospects

    }

    function searches($http){
      var apiKey = "X1-ZWz1f1owqx0utn_70ucn"
      var zillowUrlBase = "http://www.zillow.com/webservice/GetSearchResults.htm?zws-id=" + apiKey
      var zillowDeepCompsBase = "http://www.zillow.com/webservice/GetDeepComps.htm?zws-id=" + apiKey
      var zillowUpdatedDetails = "http://www.zillow.com/webservice/GetUpdatedPropertyDetails.htm?zws-id=" + apiKey
      var zillowChart = "http://www.zillow.com/webservice/GetChart.htm?zws-id=" + apiKey
      searches = {}
      var prospectsUrl = 'api/v1/prospects'

      searches.runSearch = function(address,cityStateZip){
        var zillowUrl = zillowUrlBase + "&address=" + address + "&citystatezip="+ cityStateZip
        return $http.get(zillowUrl)
      }

      searches.getDeepComps = function(zpid){
        var zillowUrl = zillowDeepCompsBase + "&zpid=" + zpid + "&count=10"
          console.log("Zillow deep comps: " + zillowUrl)
          return $http.get(zillowUrl)
      }

      searches.getUpdatedDetails = function(zpid){
        var zillowUrl = zillowUpdatedDetails + "&zpid=" + zpid
          console.log("Zillow updated details: " + zillowUrl)
          return $http.get(zillowUrl)
      }

      searches.getChart = function(zpid){
        var zillowUrl = zillowChart + "&unit-type=dollar&zpid=" + zpid + "&width=300&height=150&chartDuration=5years"
          console.log("Zillow chart: " + zillowUrl)
          return $http.get(zillowUrl)
      }

      return searches
    }




}())
