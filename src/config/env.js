const BasicConfig = {
    port: process.env.PORT || 3001,
    cookieMaxAge: process.env.COOKIE_MAX_AGE || 1,
    sessionSecret: process.env.SESSION_SECRET,
    afterLoginHomePageURI: `${process.env.BASE_URL}/welcome`,
}

const MsOAuth2Config = {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    tenantId: process.env.TENANT_ID,
    redirectUri: `${process.env.BASE_URL}/v1/auth/ms/cb`,
    msAuthEndpoint: process.env.MS_AUTH_ENDPOINT || 'https://login.microsoftonline.com/common/oauth2/v2.0',
    // Microsoft Graph API
    msGraphEndpoint: process.env.GRAPH_ENDPOINT || 'https://graph.microsoft.com/v1.0'
}

module.exports = { 
    BasicConfig,
    MsOAuth2Config
}