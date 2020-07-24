const http = require("http");
const data = require('../config/data')['data']
const {serverCallback} = require('../config/helper')

const server = http.createServer(serverCallback(data, 3));

module.exports = server;
