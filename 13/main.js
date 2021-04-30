var canvas = document.createElement("canvas");
width = 500;
height = 500;
canvas.width = width;
canvas.height = height;
document.body.appendChild(canvas);

var ctx = canvas.getContext("2d");




var drawvector = function(a,b){
    ctx.clearRect(0,0,width,height);
    var vx = 250;
    var vy = 250;
    var zoom = 20;
    ctx.beginPath();
    ctx.moveTo(vx,vy);
    ctx.lineTo(vx+a*zoom,vy+b*zoom);
    ctx.stroke();
}

document.getElementById("button").addEventListener("click",function(){
    console.log(1);
    var a = document.getElementById("a").value.split(",");
    var b = parseInt(a[0]);
    var c = parseInt(a[1]);
    console.log(b,c);
    drawvector(b,c);
});
