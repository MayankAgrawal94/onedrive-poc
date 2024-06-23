const { default: axios } = require("axios")
const { MsOAuth2Config } = require("../../../config/env")

const msRefreshAuthToken = async (refreshToken) => {
    const url = `${MsOAuth2Config.msAuthEndpoint}/token`
    const payload = {
        client_id: MsOAuth2Config.clientId,
        redirect_uri: MsOAuth2Config.redirectUri,
        client_secret: MsOAuth2Config.clientSecret,
        refresh_token: refreshToken,
        grant_type:'refresh_token',
    }

    const { data } = await axios.post(url, payload, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    return data;
}

module.exports = { 
    msRefreshAuthToken
}