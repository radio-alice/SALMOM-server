var socket = new WebSocket("wss://shrmn.toys/salmom");

socket.addEventListener('message', function (event) {
  alert(event.data);
});
socket.addEventListener('close', function (event) {
  console.log(event.data);
});

function start(){
  if (socket.readyState == socket.OPEN){
    socket.send("player_START");
    let element = document.getElementById('startButton');
    destroy(element);
  }
}

function destroy(element){
  element.parentNode.removeChild(element);
}

function move(x, y) {
  if (socket.readyState == socket.OPEN){
    socket.send('player_'+x+','+y+',0')
  }
}