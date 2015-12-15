(function(){
  angular.module('verisiApp')
    .factory('users', users)
    .factory('groups', groups)
    .factory('propsects', prospects)
    .factory('searches', searches)

    users.$inject = [$http]
    groups.$inject = [$http]
    prospects.$inject = [$http]
    searches.$inject = [$http]

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
        return $http.get
      }

    }




}())
