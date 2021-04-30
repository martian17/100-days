var canvas = document.createElement("canvas");
width = 500;
height = 500;
canvas.width = width;
canvas.height = height;
document.body.appendChild(canvas);

var ctx = canvas.getContext("2d");



var x = 0.1;
var y = 1;
var vx = 0;
var vy = 0;

var g = 9.8;


var start = 0;
var animate = function(t){
    if(start === 0)start = t;
    var mdt = (t - start)/1000;
    start = t;
    
    var itrs = 100000;
    //var itrs = 1;
    
    for(var i = 0; i < itrs; i++){
        var dt = mdt/itrs;
        var dist2 = x*x+y*y;
        var dist = Math.sqrt(dist2);
        var centri = (vx*vx+vy*vy)/dist;
        var accx = -g*x*y/dist2-centri*x/dist;
        var accy = g*x*x/dist2-centri*y/dist;
        var x1 = x+1/2*accy*dt*dt+dt*vx;
        var y1 = y+1/2*accx*dt*dt+dt*vy;
        x = x1;
        y = y1;
        vx += accx*dt;
        vy += accy*dt;
        //vx *= 0.99999999;
        //vy *= 0.99999999;
    }
    
    render();

    requestAnimationFrame(animate);
};


var render = function(){
    ctx.clearRect(0,0,width,height);
    var vpx = 250;
    var vpy = 250;
    var zoom = 100;
    ctx.beginPath();
    ctx.moveTo(vpx,vpy);
    ctx.lineTo(vpx+x*zoom,vpy+y*zoom);
    ctx.stroke();
};

requestAnimationFrame(animate);
