var canvas = document.createElement("canvas");
width = 500;
height = 500;
canvas.width = width;
canvas.height = height;
document.body.appendChild(canvas);

var ctx = canvas.getContext("2d");



var x = 0;
var y = 1;

var start = 0;
var animate = function(t){
    if(start === 0)start = t;
    var dt = (t - start)/1000;
    start = t;
    render();
    
    //setTimeout(animate,1000);
    requestAnimationFrame(animate);
};

var render = function(){
    //ctx.clearRect(0,0,width,height);
    //advance by set amount of distance
    //x += -y/Math.sqrt(x*x+y*y)*0.1;
    //y += x/Math.sqrt(x*x+y*y)*0.1;
    var vx = 250;
    var vy = 250;
    var zoom = 100;
    ctx.beginPath();
    ctx.moveTo(vx,vy);
    ctx.lineTo(vx+x*zoom,vy+y*zoom);
    ctx.stroke();
    
    var x1 = x-y*0.1;
    var y1 = y+x*0.1;
    x = x1;
    y = y1;
};

requestAnimationFrame(animate);
