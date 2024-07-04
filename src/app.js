require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const http = require('node:http');
const path = require('node:path');
const expressSession = require('./config/session.config');

const app = express();
const server = http.createServer(app);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(expressSession);

const ApiV1 = 'v1'
const { isAuthenticated } = require('./middleware/isAuthenticated')

// Importing routes
const msOauth2 = require('./app/routes/auth/msAuth.routes')
const basicAuth = require('./app/routes/auth/basicAuth.routes')
const msOnedrive = require('./app/routes/msOneDrive.routes');

// Serve the static files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    page = req.session.user ? '/welcome' : '/login'
    res.redirect(page)
})

app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')) )

app.get('/welcome', isAuthenticated, (req, res) => {
    console.log("Req come to /welcome")
    res.sendFile(path.join(__dirname, 'public', 'welcome.html'));
});

app.get(`/${ApiV1}/validate/user-session`, (req, res) => {
    let isSuccess = false, redirect = '/';
    if (req.session.user)
        isSuccess = true, redirect = '/welcome'

    return res.send({success: isSuccess,message: 'Request Executed',redirect})
})

//Microsoft OAuth2
app.use(`/${ApiV1}/auth/ms`, msOauth2)
app.use(`/${ApiV1}/ms/onedrive`, msOnedrive)

app.use(`/${ApiV1}/basic`, basicAuth);

module.exports = server;
