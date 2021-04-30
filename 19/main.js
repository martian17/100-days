var canvas = document.createElement("canvas");
width = 500;
height = 500;
canvas.width = width;
canvas.height = height;
document.body.appendChild(canvas);

var ctx = canvas.getContext("2d");


var m1 = 50;
var m2 = 50;
var l1 = 1;
var l2 = 1;
var g = 9.8;
var t1 = -1;
var t2 = -2;
var t1d = 0;
var t2d = 0;



var start = 0;
var animate = function(t){
    if(start === 0)start = t;
    var mdt = (t - start)/1000;
    start = t;
    
    var itrs = 100000;
    //var itrs = 1;
    
    for(var i = 0; i < itrs; i++){
        var dt = mdt/itrs;  
        
        var a = l1*l1*(m1+m2);
        var b = l1*l2*m2*Math.cos(t1-t2);
        var c = t2d*t2d*l1*l2*m2*Math.sin(t1-t2)-l1*Math.cos(t1)*(m1+m2)*g;
        
        var d = l1*l2*m2*Math.cos(t2-t1);
        var e = l2*l2*m2;
        var f = t1d*t1d*l1*l2*m2*Math.sin(t2-t1)-l2*Math.cos(t2)*m2*g;
        
        var t1dd = -(c/b-f/e)/(a/b-d/e);
        var t2dd = -(c/a-f/d)/(b/a-e/d);
        
        t1d += dt*t1dd;
        t2d += dt*t2dd;
        
        t1 += dt*t1d;
        t2 += dt*t2d;
        
    }
    
    render();

    requestAnimationFrame(animate);
};


var render = function(){
    ctx.clearRect(0,0,width,height);
    var vpx = 250;
    var vpy = 250;
    var zoom = 100;
    
    
    var y1 = l1*Math.sin(t1);
    var x1 = l1*Math.cos(t1);
    var y2 = l1*Math.sin(t1)+l2*Math.sin(t2);
    var x2 = l1*Math.cos(t1)+l2*Math.cos(t2);
    ctx.beginPath();
    ctx.moveTo(vpx,vpy);
    ctx.lineTo(vpx+x1*zoom,vpy+y1*zoom);
    ctx.lineTo(vpx+x2*zoom,vpy+y2*zoom);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(vpx+x1*zoom,vpy+y1*zoom,5,0,6.28);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.arc(vpx+x2*zoom,vpy+y2*zoom,5,0,6.28);
    ctx.closePath();
    ctx.fill();
};

requestAnimationFrame(animate);
