var canvas = document.createElement("canvas");
width = 500;
height = 500;
canvas.width = width;
canvas.height = height;
document.body.appendChild(canvas);

var ctx = canvas.getContext("2d");




var theta = 3;
var dtheta = 0;//velocity
var L = 1;

var g = 9.8;

var start = 0;
var animate = function(t){
    if(start === 0)start = t;
    var dt = (t - start)/1000;
    start = t;
    
    theta += -1/2*dt*dt*g/L*Math.sin(theta)+dtheta*dt;
    dtheta += -dt*g/L*Math.sin(theta);

    render();

    requestAnimationFrame(animate);
};


var render = function(){
    ctx.clearRect(0,0,width,height);
    var x = Math.sin(theta)*L;
    var y = Math.cos(theta)*L;
    var vx = 250;
    var vy = 250;
    var zoom = 100;
    ctx.beginPath();
    ctx.moveTo(vx,vy);
    ctx.lineTo(vx+x*zoom,vy+y*zoom);
    ctx.stroke();
};

requestAnimationFrame(animate);
