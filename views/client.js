var socket = new WebSocket("wss://shrmn.toys/salmom");
window.onload = function() {
    var spriteDiv = document.getElementById('start');
    console.log(spriteDiv);
}
socket.addEventListener('message', function (event) {
  let msgType = event.data.toString().split("_")[0];
  let msgContent = event.data.toString().split("_")[1];
  console.log(msgType + ' ' + msgContent);

  if (msgType == 'm') {
    alert(msgContent);
  } else if (msgType == 's' && typeof spriteDiv !== 'undefined') {
    displayImg(msgContent, spriteDiv);
    console.log('image: '+msgContent);
  } else {
    console.log('something went wrong');
  }
});

socket.addEventListener('close', function (event) {
  console.log(event);
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

function displayImg(imgFile, imgDiv){
  let imgHTML = `
    <img src="emojis/${imgFile}">
    <p class="label">This is YOU</p>
  `;
  imgDiv.innerHTML = imgHTML;
}