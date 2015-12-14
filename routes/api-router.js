var express = require('express'),
  apiRoutes = express.Router(),
  usersController = require('../controllers/users-controller.js'),
  groupsController = require('../controllers/groups-controller.js'),
  prospectsController = require('../controllers/prospects-controller.js')



apiRoutes.get('/', function(req, res){
    res.json({ message: 'we made it to the api'})
})

//USER ROUTES---------------------------------------------------------------
apiRoutes.route('/users')
  .get(usersController.getAllUsers)
  .post(usersController.createUser)

apiRoutes.route('/users/:user_id')
  .get(usersController.showUser)
  .put(usersController.editUser)
  .delete(usersController.deleteUser)


//GROUP ROUTES---------------------------------------------------------------
apiRoutes.route('/groups')
  .get(groupsController.getAllGroups)
  .post(groupsController.createGroup)

apiRoutes.route('/groups/:group_id')
  .get(groupsController.showGroup)
  .put(groupsController.editGroup)
  .delete(groupsController.deleteGroup)

//PROSPECT ROUTES--------------------------------------------------------------
apiRoutes.route('/prospects')
  .get(prospectsController.getAllProspects)
  .post(prospectsController.createProspect)

apiRoutes.route('/prospects/:prospect_id')
  .get(prospectsController.showProspect)
  .put(prospectsController.editProspect)
  .delete(prospectsController.deleteProspect)





module.exports = apiRoutes
