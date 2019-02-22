const express = require('express');
const WebSocketServer = require('ws').Server;
const https = require('http');
const fs = require('fs');
const uuid = require('short-uuid');
var port = 8080;

var options = {
                  cert: fs.readFileSync(__dirname + '/ssl/cert.pem'),
                  key: fs.readFileSync(__dirname + '/ssl/privkey.pem'),
                }

const app = express();
app.use('/salmom', express.static('views'));
app.get('/salmom', function(req, res){
    res.sendFile(__dirname + '/views/start.html');
});

var sServer = https.createServer(options, app);
sServer.listen(port, () => {
    console.log(`Server started on port ${port} :)`);
});

var wss = new WebSocketServer({ server: sServer });

var clients = [];
var clientIds = [];

wss.on('connection', function connection(ws, req) {
  console.log("CONNECTION");
  clients.push(ws);

  let clientId = uuid.generate();
  clientIds.push(clientId);

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);

    for (var i = 0; i < clients.length; i++) {

      if(clients[i].readyState === 1){
        let json = JSON.stringify({
          position: message.toString().split("_")[0],
          id: clientId[i]
        });
        clients[i].send(json);
      }
    }
  });
});