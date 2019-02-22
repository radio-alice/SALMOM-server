const express = require('express');
const WebSocket = require('ws');
const https = require('https');
const app = express();
const router = express.Router();
const fs = require('fs');

const port = 8080;

// const options = {
//                   cert: fs.readFileSync(__dirname + '/ssl/cert.pem'),
//                   key: fs.readFileSync(__dirname + '/ssl/privkey.pem'),
//                   ca: fs.readFileSync(__dirname + '/ssl/chain.pem')
//                 }
const server = https.createServer(app);
const wss = new WebSocket.Server({ server: server });

var clients = [];

app.use('/salmom', express.static('views'));

app.get('/salmom', function(req, res){
    res.sendFile(__dirname + '/views/start.html');
});

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