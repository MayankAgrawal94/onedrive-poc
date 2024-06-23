
const getProfileInfo = (req, res) => {
    const { info } = req.session.user
    res.send({
        success: true,
        message: 'Request Successful',
        data: {
            id: info.id,
            displayName: info.displayName,
            email: info.mail,
            preferredLanguage: info.preferredLanguage
        }
    })
}

const logout = async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Failed to destroy session:', err);
            return res.redirect('/error');
        }
        res.clearCookie('connect.sid'); // Clear the cookie if you're using cookies to store session id
        res.redirect('/');
    });
}

module.exports = {
    getProfileInfo,
    logout
}