var socket = new WebSocket("wss://shrmn.toys/salmom");
var spriteDiv;

socket.addEventListener('message', function (event) {
  let msgType = event.data.toString().split("_")[0];
  let msgContent = event.data.toString().split("_")[1];
  console.log(msgType + ' ' + msgContent);

  if (msgType == 'm') {
    alert(msgContent);
  } else if (msgType == 's' && typeof spriteDiv !== 'undefined') {
    displayImg(msgContent, spriteDiv);
  }
});

function start(){
  if (socket.readyState == socket.OPEN){
    socket.send("player_START");
    spriteDiv = document.getElementById('start');
    while (spriteDiv.firstChild) {
      spriteDiv.removeChild(spriteDiv.firstChild);
    }
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