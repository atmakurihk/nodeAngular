const express = require('express');

const router = express.Router();

const userController = require('../controllers/user');
module.exports=router;

router.post('/signUp',userController.createUser);

router.post('/login',userController.userLogin);
