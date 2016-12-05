const WKEY=87;
const AKEY=65;
const SKEY=83;
const DKEY=68;
var player;
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
var width = canvas.getAttribute('width');
var height = canvas.getAttribute('height');
var left = canvas.offsetLeft;
console.log(left);

function mainMenu(){
  var lingrad = ctx.createLinearGradient(0,0,0,height);
	lingrad.addColorStop(0, '#000');
	lingrad.addColorStop(1, '#067');
	ctx.fillStyle = lingrad;
	ctx.fillRect(0,0,width, height);

  ctx.textAlign = "center";
	ctx.fillStyle = "White";
  ctx.font = (height/10).toString() + "px Arial";
	ctx.fillText("Metaslave", width/2, height/10);

  var size = height/20;
  var y = height - height/3;
  var rect = [width/3 , y, width/3, 2*size]
  ctx.font = size.toString() + "px Arial";
  ctx.fillText("New Game", width/2, height-height/4);
  var mouseX, mouseY;
  canvas.addEventListener("mouseup", function(e){
      var mouse = getMousePosition(e);
      if(mouse.x > rect[0] && mouse.x < rect[0] + rect[2] && mouse.y > rect[1] && mouse.y < rect[1]+rect[3])
          gamestart();
  });
}

function gamestart(){
  player = new component(64, 64, "/static/images/robot.png", 100, 100);
  house1 = new component(128, 128, "/static/images/house1.png", 256, 256);
  house2 = new component(128, 128, "/static/images/house1.png", 640, 512);
  gameArea.start();
}

var gameArea = {

    start : function() {
        this.frameNo = 0;
        window.addEventListener('keydown', function (e) {
           gameArea.keys = (gameArea.keys || []);
           gameArea.keys[e.keyCode] = true;
       })
       window.addEventListener('keyup', function (e) {
           gameArea.keys[e.keyCode] = false;
       })
        this.interval = setInterval(updateGameArea, 30);
        },
    clear : function() {
        ctx.clearRect(0, 0, width, height);
    },
    stop : function() {
        clearInterval(this.interval);
    }

}

function component(width, height, filename, x, y) {
    this.bmp = new Image();
    this.bmp.src=filename;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.wobble = 0;
    this.wobbleIncrement = 4*Math.PI/180;
    this.maxWobble = 20*Math.PI/180;
    this.update = function() {
        ctx.save();
        if(this.speedX != 0 || this.speedY != 0){
          if(Math.abs(this.wobble) >= this.maxWobble)
            this.wobbleIncrement = -this.wobbleIncrement;
          this.wobble += this.wobbleIncrement;
          ctx.translate(this.x + this.width/2, this.y + this.height/2);
          ctx.rotate(this.wobble);
          ctx.translate(-this.x - this.width/2, -this.y - this.height/2);
        }
        else{
          this.wobble = 0;
          this.wobbleIncrement = Math.abs(this.wobbleIncrement);
        }
        ctx.drawImage(this.bmp,
          this.x,
          this.y,
          this.width, this.height);
        ctx.restore();
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
    }
}

function staticComponent() {
  this.bmp
}

function updateGameArea() {
    var lingrad = ctx.createLinearGradient(0,0,0,height);

    gameArea.clear();
    lingrad.addColorStop(0, '#000');
    lingrad.addColorStop(1, '#ddd');
    ctx.fillStyle = lingrad;
    ctx.fillRect(0,0,width, height);
    player.speedX = 0;
    player.speedY = 0;
    if(gameArea.keys){
      if(gameArea.keys[WKEY]){
        player.speedY = -4
      }
      if(gameArea.keys[AKEY]){
        player.speedX = -4
      }
      if(gameArea.keys[SKEY]){
        player.speedY = 4
      }
      if(gameArea.keys[DKEY]){
        player.speedX = 4
      }
    }
    house1.update();
    house2.update();
    player.newPos();
    player.update();
}

function getMousePosition(e){
  var rect = canvas.getBoundingClientRect(), // abs. size of element
    scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
    scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y

  return {
    x: (e.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
    y: (e.clientY - rect.top) * scaleY     // been adjusted to be relative to element
  }
}

function saveGame(){
  
}
