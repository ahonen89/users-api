var express = require('express');
var router = express.Router();
var ctrlUsers = require('../controllers/user');

// add routes
router.get('/users', ctrlUsers.getUsersList);
router.post('/users', ctrlUsers.createUser);
router.get('/users/:userId', ctrlUsers.retrieveUser);
router.put('/users/:userId', ctrlUsers.modifyUser);
router.delete('/users/:userId', ctrlUsers.deleteUser);

module.exports = router;
