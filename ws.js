const express = require('express');
const WebSocketServer = require('ws').Server;
const https = require('https');
const fs = require('fs');

var options = {
                  cert: fs.readFileSync(__dirname + '/ssl/cert.pem'),
                  key: fs.readFileSync(__dirname + '/ssl/privkey.pem'),
                }

const app = express();
app.use('/salmom', express.static('views'));
app.get('/salmom', function(req, res){
    res.sendFile(__dirname + '/views/start.html');
});

var port = 8080;

var sServer = https.createServer(options, app);
sServer.listen(port, () => {
    console.log(`Server started on port ${port} :)`);
});

var wss = WebSocketServer({ server: sServer });

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