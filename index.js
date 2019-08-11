const winston = require('winston');
const express = require('express');
const http = require('http');

const app = express();
const server = http.Server(app);

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();
require('./startup/socketio')(server);

const port = process.env.PORT || 3000; // command: export PORT=5000
server.listen(port, () => winston.info(`Listening on port ${port} with env: ${app.get('env')}`));
