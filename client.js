const port = 8080;
var socket = new WebSocket("ws://localhost:" + port);

function start(){
  socket.send("START");
  let element = document.getElementById('startButton');
  destroy(element);
}

function destroy(element){
  element.parentNode.removeChild(element);
}

function move(x, y) {
  socket.send(x+','+y+',0')
}