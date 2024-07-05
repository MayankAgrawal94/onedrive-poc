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

// Importing routes
const msOauth2 = require('./app/routes/auth/msAuth.routes')
const basicAuth = require('./app/routes/auth/basicAuth.routes')
const msOnedrive = require('./app/routes/msOneDrive.routes')
const uiRoutes = require('./app/routes/ui.routes')

// Serve the static files
app.use(express.static(path.join(__dirname, 'public')));

// Serve UI render pages
app.use(uiRoutes)

//Microsoft OAuth2
app.use(`/${ApiV1}/auth/ms`, msOauth2)
app.use(`/${ApiV1}/ms/onedrive`, msOnedrive)

app.use(`/${ApiV1}/basic`, basicAuth)

module.exports = server;
