const { msAuthReq, msCallback } = require("../../services/auth")

const initiateMicrosoftOAuth2 = (req, res) => {
    try {
        const msAuthUrl = msAuthReq();
        res.redirect(msAuthUrl)
    } catch (err) {
        console.error(`ERROR: 10 | initiateMsOAuth2`, err)
        res.code(500).send({success: false, message: 'Something went wrong!'})
    }
}

const microsoftAuthCallback = async (req, res) => {
    try {
        const { code } = req.query
    
        const { info, auth } = await msCallback(code)
    
        if( !info || !auth ) return res.status(500).send('Error:05 | Authentication failed.')
    
        req.session.user = {info, auth}
            
        req.session.save((err) => {
            if (err) {
                console.error(err)
                return res.status(500).send('Error saving session')
            }
            res.redirect('http://localhost:3001/welcome')
            console.log(`session: ${req.sessionID} | ATH-MS | microsoftAuthCallback | Request Successfull`)
        })
    } catch (err) {
        console.error(`session: ${req.sessionID} | ERROR: ATH-MS-ER-20 | microsoftAuthCallback`, err)
        return res.status(500).send('Error:10 | Authentication failed.')
    }
}

const microsoftUserSessionLogout = async () => {
    //  Todo
}

module.exports = {
    initiateMicrosoftOAuth2,
    microsoftAuthCallback
}