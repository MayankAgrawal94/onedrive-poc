
// middleware to test if authenticated
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        req['msAccessToken'] = req.session.user.auth.access_token
        next()
    }
    else res.redirect('/')
}

module.exports = {isAuthenticated}