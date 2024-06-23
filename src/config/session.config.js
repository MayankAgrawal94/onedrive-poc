const session = require('express-session');
const { BasicConfig } = require('./env');

// Configure Express session
const expressSession = session({
    // store: RedisStore,
    secret: BasicConfig.sessionSecret,  //  secret-key
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,  // Set to true if using https
        maxAge: Number(BasicConfig.cookieMaxAge) * (24 * 60 * 60 * 1000)    // 24 hours
    }
})

module.exports = expressSession;