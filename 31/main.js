
var G = 1;

var s = 10;
var r = 50;
var b = 2.6667;

var x = 5;
var y = 8;
var z = 10;

var step = function(dt){
    var dxdt = -s*x+s*y;
    var dydt = -x*z+r*x-y;
    var dzdt = x*y-b*z;
    x += dxdt*dt;
    y += dydt*dt;
    z += dzdt*dt;
};




var canvas = document.createElement("canvas");
document.body.appendChild(canvas);

var width = 500;
var height = 500;

canvas.width = width;
canvas.height = height;

var ctx = canvas.getContext("2d");
ctx.fillStyle = "#ffffff05";


var adjustCoord = function(x0,y0){
    return [x0*5+width/2,-y0*5+height];
};


var start = 0;

var animate = function(t){
    if(start === 0){
        start = t;
    }
    var dt = t - start;
    start = t;


    ctx.fillRect(0,0,width,height);
    ctx.beginPath();
    var adj = adjustCoord(x,z);
    ctx.moveTo(adj[0],adj[1]);

    var steps = 100;
    for(var i = 0; i < steps; i++){
        step(dt/steps/1000);
        adj = adjustCoord(x,z);
        ctx.lineTo(adj[0],adj[1]);
    }
    
    ctx.stroke();

    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

