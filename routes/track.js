var express = require('express');
var router = express.Router();
var user_controller = require('../controllers/userController');


// Get Homepage

router.get('/', user_controller.index)
// GET create user form

router.get('/createuser', user_controller.create_user_get)

// POST create user form

router.post('/createuser', user_controller.create_user_post)

// GET Update Blood pressure form 
router.get('/update', user_controller.update_user_get)

// POST Update Blood pressure form 
router.post('/update', user_controller.update_user_post)

// GET Blood pressure graph
router.get('/view', user_controller.graph_view_get)

// POST Blood pressure graph
router.post('/view', user_controller.graph_view_post)
// GET JSON Blood pressure data

router.get('/:username/JSON', user_controller.user_json_get)

module.exports = router;