const express = require('express');
const serveStatic = require('serve-static');
const path = require('path');
const Logger = require('@ptkdev/logger');

const logger = new Logger();
const server = express();
server.use(serveStatic(path.join(__dirname, 'dist')));
const port = process.env.PORT || 80;
const host = process.env.HOST || 'khanos-frontend.herokuapp.com';
server.listen(port, () => {
  logger.info('The app is running...');
  logger.info(`http://${host}:${port}`);
});
module.exports = server;
