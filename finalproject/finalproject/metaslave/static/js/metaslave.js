const WKEY=87;
const AKEY=65;
const SKEY=83;
const DKEY=68;
const EKEY=69;
const XKEY=88;
var player;
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
var width = canvas.getAttribute('width');
var height = canvas.getAttribute('height');
var left = canvas.offsetLeft;
var currentGameMap;
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
  this.npcs = new Image();
  this.tiles.src = "/static/images/tiles.png";
  this.objects.src = "/static/images/building.png";
  this.numObjectTiles = 9;
  this.npcs.src = "/static/images/npcs.png";
  this.visualGrid = visual;
  this.objectGrid = objects;
  this.getTile = function(row,col){
    return this.visualGrid[row*cols + col]
  }
  this.getObjectTile = function(row, col){
    var tile = new Array();
    tile = []
    tile[0] = this.objectGrid[row*cols + col]
    if(tile[0] > this.numObjectTiles){
      tile[1] = this.npcs
      tile[0] -= this.numObjectTiles
    }
    else
      tile[1] = this.objects
    return tile;
  }

  this.addObject = function(object){
    if(object.length == undefined)
      this.objectGrid[object.row*cols + object.col] = object.id;
    else{
      for(var i = 0; i < object.length; ++i){
        this.objectGrid[object[i].row*cols + object[i].col] = object[i].id;
      }
    }
  }

  this.removeObject = function(object){
    if(object.length == undefined)
      this.objectGrid[object.row*cols + object.col] = 0;
    else{
      for(var i = 0; i < object.length; ++i)
        this.objectGrid[object[i].row*cols + object[i].col] = 0;
    }
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
            if(object[0] > 0)
              ctx.drawImage(
                object[1],
                (object[0]-1) * tileSize,
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
      if(object[0] > 0){
        ctx.drawImage(
            object[1],
            (object[0]-1) * tileSize,
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
          if(object[0] > 0){
            ctx.drawImage(
              object[1],
              (object[0]-1) * tileSize,
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

function gameMap(tilemap, npcs, left, right, down, up){
  this.tilemap = tilemap;
  this.npcs = npcs;
  if(this.npcs)
    this.tilemap.addObject(npcs);
  this.nextMap = [];
  this.nextMap[0] = right;
  this.nextMap[1] = left;
  this.nextMap[2] = up;
  this.nextMap[3] = down;
  this.actionObject = npcs[0];

  this.drawTileMap = function() {
    tilemap.drawTileMap();
  }

  this.update = function(row, col, direction){
    tilemap.updateTiles(row, col, direction);
    for(var i = 0; i < this.npcs.length; ++i)
      this.npcs[i].update();
  }

  this.getObject = function(row, col){
    return tilemap.getObjectTile(row, col);
  }

  this.getTile = function(row, col){
    return tilemap.getTile(row, col);
  }
}


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
           0, 1, 2, 2, 2, 3, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0];

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
      if(mouse.x > rect[0] && mouse.x < rect[0] + rect[2] && mouse.y > rect[1] && mouse.y < rect[1]+rect[3]){
          removeEventListener("mouseup", this);
          gamestart();
      }
  });
}

function gamestart(){
  player = new component(64, 64, "/static/images/new_robot.png", 128, 128);
  var npcs = new Array()
  npcs[0] = new npc(6, 7, 11, ['Hello!', 'My name is Paul.']);
  //npcs[1] = new npc(10, 6, 13, ['What is the meaning of life?']);
  currentGameMap = new gameMap(map1, npcs)
  currentGameMap.drawTileMap();
  player.update();
  gameArea.start();
}

var gameArea = {

    start : function() {
        this.frameNo = 0;
        this.keys = [];
        this.lastKey = new Array();
        window.addEventListener('keydown', onKeydown);
        window.addEventListener('keyup', onKeyup);
        this.interval = setInterval(updateGameArea, 20);
    },
    clear : function() {
        ctx.clearRect(0, 0, width, height);
    },
    stop : function() {
        window.removeEventListener('keydown', onKeydown);
        window.removeEventListener('keyup', onKeyup);
        clearInterval(this.interval);
    }

}

function onKeydown(e) {
  key = e.keyCode;
  if(key == EKEY){
      gameArea.stop();
      playerMenu.start();
  }
/*  if(key == XKEY){
    if(currentGameMap.actionObject.nextToPlayer()){
      gameArea.stop();
      currentGameMap.actionObject.action();
    }
  }*/
  if(!gameArea.keys[key]){
    gameArea.keys[key] = true;
    gameArea.lastKey.unshift(key);
  }

  /*
  if(player.moving == 0){
      if(key == WKEY){
          player.moving = 4;
          //player.wobbleIncrement *= -1;
        }
        if(key == AKEY){
          player.moving = 2;
          //player.wobbleIncrement *= -1;
        }
        if(key == SKEY){
          player.moving = 3;
        }
        if(key == DKEY){
          player.moving = 1;
        }
    }*/
}

function onKeyup(e) {
  key = e.keyCode;
  gameArea.keys[key] = false;
  for(var i = 0; i < gameArea.lastKey.length; ++i){
    if(gameArea.lastKey[i] == key)
      gameArea.lastKey.splice(i, 1);
  }
  /*
    if(player.moving > 0){
      key = e.keyCode;
      if(key == WKEY || key == SKEY || key == AKEY || key == DKEY)
        player.moving = 0;
    }*/
}

function npc(row, col, id, text) {
    this.row = row;
    this.col = col;
    this.id = id;
    this.text = text;
    this.talk = false;
    //this.talkFunction = talkFunction;

    this.update = function() {
        this.talk = this.nextToPlayer();
        if(this.talk)
          currentGameMap.actionObject = this;
    }

    this.nextToPlayer = function() {
        if(this.row == player.tiley && Math.abs(this.col - player.tilex) == 1)
            return true;
        else if(this.col == player.tilex && Math.abs(this.row - player.tiley) == 1)
            return true;
        else
            return false;
    }

    this.action = function() {
      conversation.start();
      conversation.text = this.text;
      conversation.len = this.text.length;
    }
}

var conversation = {
  start : function() {
      this.frameNo = 0;
      this.index = 0;
      this.text;
      this.len;
      this.statement = 0;
      this.next = false;
      this.keys = []
      this.done = false;
      window.addEventListener('keydown', function (e) {
         conversation.keys[e.keyCode] = true;
     })
     window.addEventListener('keyup', function (e) {
         conversation.keys[e.keyCode] = false;
     })
      this.interval = setInterval(updateConversation, 20);
      },
  clear : function() {
      ctx.clearRect(0, 0, width, height);
  },
  stop : function() {
      clearInterval(this.interval);
  }
}

function updateConversation(){
    if(conversation.next && conversation.keys[XKEY]){
      if(++conversation.statement < conversation.len){
        conversation.next = false;
        conversation.index = 0;
      }
      else {
        conversation.done = true;
        conversation.stop()
        gameArea.start()
      }
    }
    if(conversation.frameNo == 0 && !conversation.done){
      if(conversation.index < conversation.text[conversation.statement].length){
        console.log(conversation.text[conversation.statement].charAt(conversation.index++));
      }
      else if(!conversation.next){
        conversation.next = true;
        console.log('');
      }
    }
    conversation.frameNo = ++conversation.frameNo%2;
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
  var object;
  if(player.nextmove){
    player.nextmove = false;
    player.moving = 0;
  }

  if(gameArea.keys && player.moving == 0){
    if(gameArea.keys[DKEY] && gameArea.lastKey[0] == DKEY){
      var object;
      if(player.tilex == (cols - 1))
        object = currentGameMap.getObject(player.tiley, player.tilex) + 1
      else
        object = currentGameMap.getObject(player.tiley, player.tilex + 1)
      if(object[0] <= 0)
        player.moving = 1
    }
    else if(gameArea.keys[AKEY] && gameArea.lastKey[0] == AKEY){
      var object;
      if(player.tilex == 0)
        object = currentGameMap.getObject(player.tiley, player.tilex) + 1
      else
        object = currentGameMap.getObject(player.tiley, player.tilex - 1)
      if(object[0] <= 0)
        player.moving = 2
    }
    else if(gameArea.keys[SKEY] && gameArea.lastKey[0] == SKEY){
      var object;
      if(player.tiley == (rows - 1))
        object = currentGameMap.getObject(player.tiley, player.tilex) + 1
      else
        object = currentGameMap.getObject(player.tiley  + 1, player.tilex)
      if(object[0] <= 0)
        player.moving = 3
    }
    else if(gameArea.keys[WKEY] && gameArea.lastKey[0] == WKEY){
      if(player.tiley == 0)
        object = currentGameMap.getObject(player.tiley, player.tilex) + 1
      else
        object = currentGameMap.getObject(player.tiley - 1, player.tilex)
      if(object[0] <= 0)
        player.moving = 4;
    }
  }
  if(player.moving > 0){
    currentGameMap.update(player.tiley, player.tilex, player.moving);
    player.newPos();
    player.update();
  }
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

var playerMenu = {
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

function saveGame(){
    $.ajax({
        type:"POST",
        url:"/game/save/",
        data: {
            //csrfmiddlewaretoken: '{{ csrf_token }}',
            name:'bob',
            x_position: player.x.toString(),
            y_position: player.y.toString(),
            currentGameMap: 'map1'

        },
        success:function(){}
      });
}
