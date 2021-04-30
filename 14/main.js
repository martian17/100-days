var canvas = document.createElement("canvas");
width = 500;
height = 500;
canvas.width = width;
canvas.height = height;
document.body.appendChild(canvas);

var ctx = canvas.getContext("2d");



var x = 1;
var y = -1;

var g = 9.8;

var start = 0;
var animate = function(t){
    if(start === 0)start = t;
    var dt = (t - start)/1000;
    start = t;

    var r2 = x*x+y*y;
    var accx = -g*Math.abs(x)*y/r2;
    var accy = g*Math.abs(x)*x/r2;
    x += accx*dt;
    y += accy*dt;

    render();

    requestAnimationFrame(animate);
};


var render = function(){
    ctx.clearRect(0,0,width,height);
    var vx = 250;
    var vy = 250;
    var zoom = 10;
    ctx.beginPath();
    ctx.moveTo(vx,vy);
    ctx.lineTo(vx+x*zoom,vy+y*zoom);
    ctx.stroke();
};

requestAnimationFrame(animate);
