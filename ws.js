const express = require('express');
const WebSocket = require('ws');
const playerSocketServer = require('ws').Server;
const https = require('http');
const fs = require('fs');
const crypto = require('crypto');

const sprites = fs.readdirSync(__dirname + '/views/emojis/');
var port = 8080;
var options = {cert: fs.readFileSync(__dirname + '/ssl/cert.pem'),
                key: fs.readFileSync(__dirname + '/ssl/privkey.pem')}

const app = express();
app.use('/salmom', express.static('views'));
app.get('/salmom', function(req, res){
    res.sendFile(__dirname + '/views/start.html');
});

var sServer = https.createServer(options, app);
sServer.listen(port, () => {
    console.log(`Server started on port ${port} :)`);
});

var wss = new playerSocketServer({ server: sServer });
var clients = [];

// receive string data and send out JSON data
wss.on('connection', function connection(ws, req) {
  console.log("CONNECTION");

  //assign unique id
  let clientId = crypto.randomBytes(16).toString("hex");
  // declare and push new client (initialize as player)
  let thisClient = new Client (ws, clientId, false);
  clients.push(thisClient);

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    // divide up parts of message
    //    part 1 indicates whether its a game or a player
    //    if game: part 2 indicates id of player to send message to,
    //             part 3 is avatar id (to be sent to player client)
    //    if player: part 2 indicates how to move the character in game,
    //               no part 3
    let msgType = message.toString().split("_")[0];
    let msgTwo = message.toString().split("_")[1];

    // update object in clients array to be a game
    if (msgType == 'gameInit'){
      gameInit(clientId);
    }
    // send message from game object to given player client recipient
    else if (msgType == 'game') {
      let msgForplayer = message.toString().split("_")[2];
      gameMsg(msgTwo, msgForplayer);
    }
    // send message from player client to game(s)
    else if (msgType == 'player') {
      playerMsg(clientId, thisClient.ws, msgTwo);
    }
  });

  ws.on('close', function close(){
    if (thisClient.game) { // if the game closed, reset clients array
      gameClose();
    } else { // if the player closed, remove player
      //tell unity to remove player
      playerMsg(clientId, thisClient.ws, 'close');
      //remove player from clients array
      clients = clients.filter(obj => obj.id != clientId);
    }
  })
});

class Client {
  constructor (ws, id, game){
    this.ws = ws;
    this.id = id;
    this.game = game;
  }
}

function gameInit(gameId) {
  clients.find(obj => obj.id == gameId).game = true;
}

function gameMsg(playerId, msgForPlayer) {
  let playerRecipient = clients.find(obj => obj.id == playerId);
  if (playerRecipient !== undefined){
    playerRecipient.ws.send(msgForPlayer);
  }
  console.log("game sent " + msgForPlayer + " to" + playerRecipient.id)
}

function playerMsg(playerId, playerWS, msgPosition) {
  let games = clients.filter(obj => obj.game);
  if (games === undefined || games.length == 0) {
    if (playerWS.readyState === 1){
      playerWS.send('m_refresh the browser and wait for the game to start this time');
      playerWS.close();
    }
  } else {
    for (let i = 0; i < games.length; i++) {
      if(games[i].ws.readyState === 1){
        let sprite = chooseSprite(Math.random());
        let json = JSON.stringify({
          position: msgPosition,
          id: playerId,
          sprite: sprite
        });
        games[i].ws.send(json);
        playerWS.send('s_'+sprite);
        console.log("player: " + playerId + " sent " + msgPosition);
      }
    }
  }
}

function gameClose(){
  console.log('game closed');
  for (let i = 0; i < clients.length; i++){
    if (clients[i].ws.readyState === WebSocket.OPEN){
      clients[i].ws.send('m_Game has closed, refresh your browser window or lose hope.');
      clients[i].ws.close();
    }
  }
  clients = [];
}

function chooseSprite(rand){
  let index = Math.floor(rand * sprites.length);
  console.log('returned sprite: '+sprites[index]);
  return (sprites[index]);
}