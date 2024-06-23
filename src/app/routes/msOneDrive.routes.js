const express = require('express');
const { getMsOneDriveFiles } = require('../controllers/msOneDrive.controller');
const { isAuthenticated } = require('../../middleware/isAuthenticated');
const router = express.Router();

router.get('/files/list', isAuthenticated, getMsOneDriveFiles);

module.exports = router;