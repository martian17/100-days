var canvas = document.createElement("canvas");
document.body.appendChild(canvas);

var width = 500;
var height = 500;

canvas.width = width;
canvas.height = height;

var ctx = canvas.getContext("2d");




var l = 150;
var k = 10000;
var m = 100;
var x0 = 250;
var y0 = 0;
var x = 100;
var y = 100;
var vx = 0;
var vy = 0;
var g = 1000;

var render = function(){
    ctx.clearRect(0,0,width,height);
    ctx.beginPath();
    ctx.moveTo(x0,y0);
    ctx.lineTo(x0+x,y0+y);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x0+x,y0+y,10,0,6.28);
    ctx.closePath();
    ctx.stroke();
    //ctx.fill();
};

var calc = function(dt){
    var dist2 = x*x+y*y;
    var dist = Math.sqrt(dist2);
    var dd = dist-l;
    var acc = -dd*k/m;
    var accx = acc*x/dist;
    var accy = acc*y/dist+g;
    vx += accx*dt;
    vy += accy*dt;
    x += vx*dt;
    y += vy*dt;
};


var start = 0;

var animate = function(t){
    if(start === 0)start = t;
    var itv = t-start;
    start = t;

    var steps = 10;
    for(var i = 0; i < steps; i++){
        calc(itv/steps/1000);
    }

    render();
    requestAnimationFrame(animate);
};

requestAnimationFrame(animate);
