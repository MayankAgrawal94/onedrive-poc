const { MsOAuth2Config } = require('../../../config/env');
const { jsonToQueryString } = require('../../helpers/genericFun');

const msAuthReq = () => {
    let url = `${MsOAuth2Config.msAuthEndpoint}/authorize`
    const queryPayload = {
        client_id: MsOAuth2Config.clientId,
        // scope: 'user.read files.readwrite offline_access',
        scope: 'user.read files.read offline_access',
        response_type: 'code',
        redirect_uri: MsOAuth2Config.redirectUri
    }
    url += jsonToQueryString(queryPayload)

    return url
}

module.exports = { 
    msAuthReq
}