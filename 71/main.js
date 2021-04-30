var canvas = document.createElement("canvas");
var width = 1000;
var height = 500;
canvas.width = width;
canvas.height = height;
document.body.appendChild(canvas);
var ctx = canvas.getContext("2d");

function mulberry32(a) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}


var keydown = "none";

var upkey = false;
var dnkey = false;


document.addEventListener("keydown",
function(e){
    e.preventDefault();
    if(e.keyCode === 38){//up
        upkey = true;
        keydown = "upkey";
    }
    if(e.keyCode === 40){//down
        dnkey = true;
        keydown = "dnkey";
    }
});

document.addEventListener("keyup",
function(e){
    if(e.keyCode === 38){//up
        upkey = false;
    }
    if(e.keyCode === 40){//down
        dnkey = false;
    }
    keydown = "none";
});




var Game = function(){
    var x = 0;

    var birdx = 0;
    var birdy = 250;
    var birdvy = 0;

    var chunks = {};
    var proceduralGeneration = function(){
        //uses x in this scope
        //produces around 3 chunks
        var currentChunk = Math.floor(x/300);//chunk 300px
        for(var i = currentChunk-3; i < currentChunk+7; i++){
            if(!(i in chunks)){
                //generation
                generateChunk(i);
                console.log(chunks[i]);
            }
        }
    };
    var proceduralDeletion = function(){
        //uses x in this scope
        //produces around 3 chunks
        var currentChunk = Math.floor(x/300);//chunk 300px
        for(var string_i in chunks){
            i = parseInt(string_i);
            if(i < currentChunk-5 || i > currentChunk+8){
                delete chunks[i];
            }
        }
    };

    var generateChunk = function(key){//key is int
        var randgen = mulberry32(key);
        var chunk = {
            bars:[]
        };
        //bars consist of top and bottom
        //min gap is 50px
        if(key !== 0){
            var gap = randgen(0)*200+50;
            var bottom = randgen(1)*(400-gap)+50;
            var top = gap+bottom;
            chunk.bars.push([150,bottom,top]);
        }
        chunks[key] = chunk;
    };


    var maneuver = function(dt){
        birdx += dt/1000*250;
        birdvy -= dt/1000*500;
        birdy += dt/1000*birdvy;
        if(upkey){
            upkey = false;
            birdvy = 200;//-birdvy;
        }
        /*
        if(keydown === "upkey"){
            birdy += dt/1000*200;
        }else if(keydown === "dnkey"){
            birdy -= dt/1000*200;
        }
        */
    }

    var process = function(dt){
        x = birdx-150;
        //process collision etc
        for(var string_i in chunks){//check every chunks
            var i = parseInt(string_i);
            var chunk = chunks[i];
            var bars = chunk.bars;
            for(var j = 0; j < bars.length; j++){
                var bar = bars[j];
                var barx = bar[0]+i*300;
                var bottom = bar[1];
                var top = bar[2];
                /*if((barx-12 < birdx && birdx < barx+12) &&
                   (birdy < bottom-10 || top < birdy-10)){
                    console.log("game over");
                    gameOver();
                }*/
                if((barx-10 < birdx && birdx < barx+10) &&
                   (birdy-10 < bottom || top < birdy+10)){
                    console.log("game over");
                    gameOver();
                }
            }
        }
    };

    var drawWall = function(x,y0,y1){
        ctx.fillStyle = "#aaa";
        ctx.strokeStyle = "#555";
        var x0 = x-5;
        var x1 = x+5;

        var th = y0;
        var bh = y0+50;
        while(bh < y1){
            ctx.fillRect(x0,th,10,50);
            ctx.strokeRect(x0,th,10,50);
            th+=50;
            bh+=50;
        }
        ctx.fillRect(x0,th,10,y1-th);
        ctx.strokeRect(x0,th,10,y1-th);
    };

    var render = function(){
        ctx.clearRect(0,0,width,height);
        //bird
        ctx.beginPath();
        ctx.arc(birdx-x,500-birdy,10,0,Math.PI*2);
        ctx.closePath();
        ctx.strokeStyle = "#000";
        ctx.stroke();

        //boxes
        for(var string_i in chunks){//check every chunks
            var i = parseInt(string_i);
            var chunk = chunks[i];
            var bars = chunk.bars;
            for(var j = 0; j < bars.length; j++){
                var bar = bars[j];
                var barx = bar[0]+i*300;
                var bottom = bar[1];
                var top = bar[2];

                drawWall(barx-x,0,height-top);
                drawWall(barx-x,height-bottom,height);
            }
        }

        //score
        ctx.font = "30px Arial";
        ctx.fillStyle = "#f44";
        ctx.fillText(""+Math.round(birdx),width-100,height-50);
    }

    var gameOver = function(){
        gameover = true;
        paused = true;
        var a = body.add("div",false,false,"width:1000px;height:500px;position:absolute;top:0px;background-color:#00000044;padding:100px;text-align:center;");
        a.add("div","game over",false,"margin:20px;padding:5px;font-size:20px;background-color:#ffffff00;");
        a.add("div","score: "+Math.round(birdx),false,"margin:20px;padding:5px;font-size:20px;background-color:#ffffff00;");
        var b = a.add("div","try again",false,"margin:20px;padding:5px;font-size:20px;background-color:#ffffff44;");

        b.e.restart = restart;

        b.e.addEventListener("click",function(e){
            this.parentNode.parentNode.removeChild(this.parentNode);
            this.restart();
        });
    }

    var start = 0;
    var gameover = false;
    var paused = false;

    var routine = function(t){
        if(start === 0)start = t;
        var dt = t - start;
        start = t;
        if(paused){
        }else{
            proceduralGeneration();
            proceduralDeletion();
            maneuver(dt);
            process(dt);
            render();
        }
        requestAnimationFrame(routine);
    }

    this.init = function(){
        requestAnimationFrame(routine);
    }
    var resumeGame = function(){
        paused = false;
    }
    var restart = function(){
        paused = false;
        gameover = false;
        x = 0;

        birdx = 0;
        birdy = 250;
        birdvy = 0;

        chunks = {};
    }

}

var scene = new Game();
scene.init();