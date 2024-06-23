const { default: axios } = require("axios")
const { MsOAuth2Config } = require("../../../config/env")

const msCallback = async (code) => {
    const url = `${MsOAuth2Config.msAuthEndpoint}/token`
    const payload = {
        client_id: MsOAuth2Config.clientId,
        redirect_uri: MsOAuth2Config.redirectUri,
        client_secret: MsOAuth2Config.clientSecret,
        code,
        grant_type:'authorization_code',
    }

    const { data } = await axios.post(url, payload, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    if( data ) {
        let userData = await getUserData(data.access_token)
        if( userData ) return { info: userData, auth: data }
        return { auth: data }
    }
    return;
}

const getUserData = async (access_token) => {
    const { data } = await axios.get(`${MsOAuth2Config.msGraphEndpoint}/me`, {
        headers: {
            Authorization: `Bearer ${access_token}`
        }
    });
    return data;
}

module.exports = { 
    msCallback
}
