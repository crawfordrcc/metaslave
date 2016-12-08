const WKEY=87;
const AKEY=65;
const SKEY=83;
const DKEY=68;
const EKEY=69;
var player;
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
var width = canvas.getAttribute('width');
var height = canvas.getAttribute('height');
var left = canvas.offsetLeft;
var currentTileMap
tileSize = 64;
cols = 16;
rows = 12;
/*
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
 */
function tilemap(visual, objects){
  //this.tileSize = 64;
  //this.cols = 12;
  //this.rows = 16;
  this.tiles = new Image();
  this.objects = new Image();
  this.tiles.src = "/static/images/tiles.png";
  this.objects.src = "/static/images/building.png";
  this.visualGrid = visual;
  this.objectGrid = objects;
  this.getTile = function(row,col){
    return this.visualGrid[row*cols + col]
  }
  this.getObjectTile = function(row, col){
    return this.objectGrid[row*cols + col]
  }
  this.drawTileMap = function(){
    for (var c = 0; c < cols; c++) {
        for (var r = 0; r < rows; r++) {
            var tile = this.getTile(r, c);
            var object = this.getObjectTile(r, c);
            ctx.drawImage(
                this.tiles,
                tile * tileSize,
                0,
                tileSize,
                tileSize,
                c * tileSize,  // target x
                r * tileSize, // target y
                tileSize,
                tileSize
            );
            if(object > 0)
              ctx.drawImage(
                this.objects,
                (object-1) * tileSize,
                0,
                tileSize,
                tileSize,
                c * tileSize,  // target x
                r * tileSize, // target y
                tileSize,
                tileSize
              )
        }
    }
  }
  this.updateTiles = function(playerRow, playerCol, direction){
    tile = this.getTile(playerRow, playerCol)
    ctx.drawImage(
        this.tiles,
        tile * tileSize,
        0,
        tileSize,
        tileSize,
        playerCol * tileSize,  // target x
        playerRow * tileSize, // target y
        tileSize,
        tileSize
    );
    if(playerRow!= 0){
      tile = this.getTile(playerRow - 1, playerCol)
      ctx.drawImage(
          this.tiles,
          tile * tileSize,
          0,
          tileSize,
          tileSize,
          playerCol * tileSize,  // target x
          (playerRow-1) * tileSize, // target y
          tileSize,
          tileSize
      );
      object = this.getObjectTile(playerRow - 1, playerCol)
      if(object > 0){
        ctx.drawImage(
            this.objects,
            (object-1) * tileSize,
            0,
            tileSize,
            tileSize,
            playerCol * tileSize,  // target x
            (playerRow-1) * tileSize, // target y
            tileSize,
            tileSize
        );
      }
    }
    if(direction != 0){
      var c = playerCol;
      var r = playerRow;
      if(direction == 1)
        ++c;
      else if(direction == 2)
        --c;
      else if(direction == 3)
        ++r;
      else
        --r;

      tile = this.getTile(r, c)
      ctx.drawImage(
          this.tiles,
          tile * tileSize,
          0,
          tileSize,
          tileSize,
          c * tileSize,  // target x
          r * tileSize, // target y
          tileSize,
          tileSize
      );
      if(r != 0){
          tile = this.getTile(--r, c)
          ctx.drawImage(
            this.tiles,
            tile * tileSize,
            0,
            tileSize,
            tileSize,
            c * tileSize,  // target x
            r * tileSize, // target y
            tileSize,
            tileSize
          );
          object = this.getObjectTile(r, c)
          if(object > 0){
            ctx.drawImage(
              this.objects,
              (object-1) * tileSize,
              0,
              tileSize,
              tileSize,
              c * tileSize,  // target x
              r * tileSize, // target y
              tileSize,
              tileSize
            );
          }
      }
    }
  }
};


visual1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0,
           0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0,
           0, 0, 0, 0, 0, 0, 10, 3, 3, 3, 3, 8, 0, 0, 0, 0,
           0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
           0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
           3, 3, 3, 3, 3, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0,
           0, 0, 0, 0, 0, 0, 6, 8, 0, 0, 0, 0, 0, 0, 0, 0,
           0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
           0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
           0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
           0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
           0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];

object1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0,
           0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
           0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
           0, 0, 0, 0, 0, 0, 0, 7, 8, 8, 9, 0, 0, 0, 0, 0,
           0, 0, 0, 0, 0, 0, 0, 4, 5, 5, 6, 0, 0, 0, 0, 0,
           0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 3, 0, 0, 0, 0, 0,
           0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
           0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
           0, 7, 8, 8, 8, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
           0, 4, 5, 5, 5, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
           0, 4, 5, 5, 5, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
           0, 1, 2, 2, 2, 3, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0]

var map1 = new tilemap(visual1, object1)

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
  player = new component(64, 64, "/static/images/new_robot.png", 128, 128);
  currentTileMap = map1;
  currentTileMap.drawTileMap();
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
        this.interval = setInterval(updateGameArea, 20);
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
    this.moving = 0;
    this.nextmove = false;
    this.tilex = x/tileSize
    this.tiley = y/tileSize
    this.x = x;
    this.y = y;
    this.wobble = 0;
    this.wobbleIncrement = 3*Math.PI/180;
    this.maxWobble = 24*Math.PI/180;
    this.update = function() {
        ctx.save();
        if(this.moving != 0){
          if(Math.abs(this.wobble) >= this.maxWobble)
            this.wobbleIncrement = -this.wobbleIncrement;
          this.wobble += this.wobbleIncrement;
          ctx.translate(this.x + tileSize/2, this.y + tileSize/2);
          ctx.rotate(this.wobble);
          ctx.translate(-this.x - tileSize/2, -this.y - tileSize/2);
        }
        else{
          this.wobble = 0;
          this.wobbleIncrement = Math.abs(this.wobbleIncrement);
        }
        ctx.drawImage(this.bmp,
          this.x,
          this.y,
          tileSize,
          tileSize);
        ctx.restore();
    }
    this.newPos = function() {
      var nTilex = 0;
      var nTiley = 0;
      if(this.moving == 1){
        this.x += tileSize/16
        nTilex = 1;
      }
      else if(this.moving == 2){
        this.x -= tileSize/16
        nTilex = -1;
      }
      else if(this.moving == 3){
        this.y += tileSize/16
        nTiley = 1;
      }
      else if(this.moving == 4){
        this.y -= tileSize/16
        nTiley = -1;
      }
      if(this.moving != 0){
        if((this.x%tileSize == 0) && (this.y%tileSize == 0)){
          this.nextmove = true;
          this.tilex += nTilex;
          this.tiley += nTiley;
        }
      }
    }
}

function staticComponent(){
  this.bmp = new Image();
  this.bmp.src=filename;
  this.width = width;
  this.height = height;
}

function updateGameArea() {
  if(gameArea.keys){
    if(gameArea.keys[EKEY]){
      saveGame();
    }
  }
    if(player.nextmove){
      player.nextmove = false;
      player.moving = 0;
    }
    if(player.moving == 0){
      if(gameArea.keys){
        if(gameArea.keys[WKEY]){
          var object;
          if(player.tiley == 0)
            object = currentTileMap.getObjectTile(player.tiley, player.tilex) + 1
          else
            object = currentTileMap.getObjectTile(player.tiley - 1, player.tilex)
          if(object <= 0)
            player.moving = 4
          //player.wobbleIncrement *= -1;
        }
        if(gameArea.keys[AKEY]){
          var object;
          if(player.tilex == 0)
            object = currentTileMap.getObjectTile(player.tiley, player.tilex) + 1
          else
            object = currentTileMap.getObjectTile(player.tiley, player.tilex - 1)
          if(object <= 0)
            player.moving = 2
          //player.wobbleIncrement *= -1;
        }
        if(gameArea.keys[SKEY]){
          var object;
          if(player.tiley == (rows - 1))
            object = currentTileMap.getObjectTile(player.tiley, player.tilex) + 1
          else
            object = currentTileMap.getObjectTile(player.tiley  + 1, player.tilex)
          if(object <= 0)
            player.moving = 3
        }
        if(gameArea.keys[DKEY]){
          var object;
          if(player.tilex == (cols - 1))
            object = currentTileMap.getObjectTile(player.tiley, player.tilex) + 1
          else
            object = currentTileMap.getObjectTile(player.tiley, player.tilex + 1)
          if(object <= 0)
            player.moving = 1

        }
      }
    }

    currentTileMap.updateTiles(player.tiley, player.tilex, player.moving);
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
    $.ajax({
        type:"POST",
        url:"/game/save/",
        data: {
            //csrfmiddlewaretoken: '{{ csrf_token }}',
            name:'bob',
            x_position: player.x.toString(),
            y_position: player.y.toString(),
            currentTileMap: 'map1'

        },
        success:function(){}
      });


/*$.post('game/save',
{
    name : 'bob', //pass the score here
    x_position: player.x,  // pass the win value here
    y_position: player.y,
    currentTileMap: 'map1'
},
function(data) {
    if(data.status == 1){
        // success! Do something
    }
    else{
        // error! Do something
    }
});*/
}
