const express = require('express');
const { 
    initiateMicrosoftOAuth2, 
    microsoftAuthCallback
} = require('../../controllers/auth/ms.auth.controller');
const router = express.Router();

router.get('/rq', initiateMicrosoftOAuth2);
router.get('/cb', microsoftAuthCallback);

module.exports = router;