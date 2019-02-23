const port = 8080;
var socket = new WebSocket("wss://shrmn.toys/salmom");

function start(){
  if (socket.readyState == "OPEN"){
    socket.send("START");
    let element = document.getElementById('startButton');
    destroy(element);
  }
}

function destroy(element){
  element.parentNode.removeChild(element);
}

function move(x, y) {
  if (socket.readyState == "OPEN"){
    socket.send(x+','+y+',0')
  }
}