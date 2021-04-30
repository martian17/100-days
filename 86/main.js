var canvas = document.createElement("canvas");
var width = 700;
var height = 500;
canvas.width = width;
canvas.height = height;
document.body.appendChild(canvas);
var ctx = canvas.getContext("2d");


var p1 = [Math.random()*width/2+width/2,Math.random()*height/2+height/2];
var p2 = [Math.random()*width/2+width/2,Math.random()*height/2+height/2];
var p3 = [Math.random()*width/2+width/2,Math.random()*height/2+height/2];
var p4 = [Math.random()*width/2+width/2,Math.random()*height/2+height/2];

ctx.beginPath();
ctx.moveTo(p1[0],p1[1]);
ctx.lineTo(p2[0],p2[1]);
ctx.lineTo(p3[0],p3[1]);
ctx.closePath();
ctx.stroke();

ctx.beginPath();
ctx.arc(p1[0],p1[1],5,0,6.28);
ctx.closePath();
ctx.stroke();
ctx.beginPath();
ctx.arc(p2[0],p2[1],5,0,6.28);
ctx.closePath();
ctx.stroke();
ctx.beginPath();
ctx.arc(p3[0],p3[1],5,0,6.28);
ctx.closePath();
ctx.stroke();


ctx.strokeStyle = "#00f";
ctx.beginPath();
for(var u = -100; u < 100; u+=0.1){
    var x = p1[0]+(p2[0]-p1[0])/2+(p2[1]-p1[1])*u;
    var y = p1[1]+(p2[1]-p1[1])/2-(p2[0]-p1[0])*u;
    ctx.lineTo(x,y);
}
ctx.stroke();


ctx.beginPath();
for(var u = -100; u < 100; u+=0.1){
    var x = p2[0]+(p3[0]-p2[0])/2+(p3[1]-p2[1])*u;
    var y = p2[1]+(p3[1]-p2[1])/2-(p3[0]-p2[0])*u;
    ctx.lineTo(x,y);
}
ctx.stroke();


//var u = (-(p3[1]-p2[1])*(p3[1]-p1[1])-(p3[0]-p2[0])*(p3[0]-p1[0]))/(2*(((p2[0]-p1[0])*(p3[1]-p2[1]))-((p2[1]-p1[1])*(p3[0]-p2[0]))))


//var u = -((p3[1]-p2[1])*(p3[1]-p1[1])+(p3[0]-p2[0])*(p3[0]-p1[0]))/2/(((p2[0]-p1[0])*(p3[1]-p2[1]))-((p2[1]-p1[1])*(p3[0]-p2[0])))

var a = p1[0];
var b = p1[1];
var c = p2[0];
var d = p2[1];
var e = p3[0];
var f = p3[1];
var u = -((f-d)*(f-b)+(e-c)*(e-a))/2/(((c-a)*(f-d))-((d-b)*(e-c)))


var x = p1[0]+(p2[0]-p1[0])/2+(p2[1]-p1[1])*u;
var y = p1[1]+(p2[1]-p1[1])/2-(p2[0]-p1[0])*u;

var dx = x-a;
var dy = y-b;

var r2 = dx*dx+dy*dy;
var r = Math.sqrt(dx*dx+dy*dy);


ctx.beginPath();
ctx.arc(x,y,5,0,6.28);
ctx.closePath();
ctx.stroke();

ctx.strokeStyle = "#f00";
ctx.beginPath();
ctx.arc(x,y,r,0,6.28);
ctx.closePath();
ctx.stroke();


ctx.strokeStyle="#0f0";
var dcx = p4[0]-x;
var dcy = p4[1]-y;
if(r2 > dcx*dcx+dcy*dcy){
    ctx.strokeStyle="#f0f";
}
ctx.beginPath();
ctx.arc(p4[0],p4[1],5,0,6.28);
ctx.closePath();
ctx.stroke();
