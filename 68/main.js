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



var gameover = false;

var Scene = function(){
    var x = 0;

    var birdx = 0;
    var birdy = 250;
    var birdvy = 0;

    var chunks = {};
    this.proceduralGeneration = function(){
        //uses x in this scope
        //produces around 3 chunks
        var currentChunk = Math.floor(x/300);//chunk 300px
        for(var i = currentChunk-3; i < currentChunk+3; i++){
            if(!(i in chunks)){
                //generation
                generateChunk(i);
                console.log(chunks[i]);
            }
        }
    };
    this.proceduralDeletion = function(){
        //uses x in this scope
        //produces around 3 chunks
        var currentChunk = Math.floor(x/300);//chunk 300px
        for(var string_i in chunks){
            i = parseInt(string_i);
            if(i < currentChunk-5 || i > currentChunk+5){
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


    this.maneuver = function(dt){
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

    this.process = function(dt){
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
                if((barx-10 < birdx && birdx < barx+10) &&
                   (birdy < bottom || top < birdy)){
                    console.log("game over");
                    gameover = true;
                }
            }
        }
    }

    this.render = function(){
        ctx.clearRect(0,0,width,height);
        //bird
        ctx.beginPath();
        ctx.arc(birdx-x,500-birdy,10,0,Math.PI*2);
        ctx.closePath();
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

                ctx.beginPath()
                ctx.moveTo(barx-x,500);
                ctx.lineTo(barx-x,500-bottom);
                ctx.stroke();
                //console.log(barx-x,500-top,500-bottom);



                ctx.beginPath()
                ctx.moveTo(barx-x,500-top);
                ctx.lineTo(barx-x,0);
                ctx.stroke();

            }
        }
    }
}

var scene = new Scene();

var start = 0;

var routine = function(t){
    if(start === 0)start = t;
    var dt = t - start;
    start = t;
    if(gameover)return false;

    scene.proceduralGeneration();
    scene.proceduralDeletion();
    scene.maneuver(dt);
    scene.process(dt);
    scene.render();


    requestAnimationFrame(routine);
}

requestAnimationFrame(routine);