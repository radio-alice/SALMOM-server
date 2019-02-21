const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const app = express();
const server = http.createServer(app);
const port = 8080;
const wss = new WebSocket.Server({ server }, () => {
  console.log('listening on ' + port);
});

var clients = [];

wss.on('connection', function connection(ws, req) {
  console.log("CONNECTION");

  clients.push(ws);

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);

    for (var i = 0; i < clients.length; i++) {

      if(clients[i].readyState === 1){
        clients[i].send(JSON.stringify({
          position: message.toString().split("_")[0],
          id: req.connection.remoteAddress
        }));
      }
    }
  });
});

server.listen(port, () => {
    console.log(`Server started on port ${port} :)`);
});