const { msAuthReq } = require('./oauthRequest')
const { msCallback } = require('./oauthCallback')
const { msRefreshAuthToken } = require('./refreshToken')

module.exports = {
    msAuthReq,
    msCallback,
    msRefreshAuthToken
}