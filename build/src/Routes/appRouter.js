"use strict";
const { Router } = require('express');
const router = Router();
const appController = require('../Controllers/appController');
router.get('/courses', appController.getCourses);
router.post('/students', appController.addUsers);
module.exports = router;
