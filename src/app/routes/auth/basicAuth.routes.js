const express = require('express');
const { logout, getProfileInfo } = require('../../controllers/auth/basic.auth.controller');
const { isAuthenticated } = require('../../../middleware/isAuthenticated');
const router = express.Router();

router.get('/logout', isAuthenticated, logout);
router.get('/user/self', isAuthenticated, getProfileInfo)

module.exports = router;