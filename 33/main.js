var canvas = document.createElement("canvas");
document.body.appendChild(canvas);

var width = 500;
var height = 500;

canvas.width = width;
canvas.height = height;

var ctx = canvas.getContext("2d");
ctx.fillStyle = "#ffffff05";
//ctx.strokeStyle = "#00000005";
ctx.strokeStyle = "#000000";

var imagedata = ctx.getImageData(0,0,width,height);
var data = imagedata.data;

var a = 4;
var x0 = 0.01;


var moveTo = function(x,y){
    x = x*width;
    y = height-y*height;
    ctx.moveTo(x,y);
};
var lineTo = function(x,y){
    x = x*width;
    y = height-y*height;
    ctx.lineTo(x,y);
};


var render = function(){
    ctx.clearRect(0,0,width,height);
    ctx.beginPath();
    moveTo(0,0);
    for(var i = 0; i < width; i++){
        lineTo(i/width,-a*(i/width-1/2)*(i/width-1/2)+a/4);
    }
    ctx.stroke();
    ctx.beginPath();
    moveTo(0,0);
    lineTo(1,1);
    ctx.stroke();


    ctx.beginPath();
    var x = x0;
    var y = -a*(x-1/2)*(x-1/2)+a/4;
    moveTo(x,x);
    for(var i = 0; i < 20; i++){
        lineTo(x,y);
        x = a*x*(1-x);
        y = -a*(x-1/2)*(x-1/2)+a/4;
        lineTo(x,x);
    }
    ctx.stroke();
};

render();


var txt = body.add("input",false,"type:text;value:"+a+","+x0+";");
txt.e.addEventListener("keyup",
function(e){
    if(e.keyCode === 13){
        var vals = txt.e.value.split(",").map(function(a){
            if(isNaN(a)){
                return 0;
            }
            a = parseFloat(a);
            return a;
        });
        console.log(vals);
        a = vals[0] || 3;
        x0 = vals[1] || 0.3;
        txt.e.value = a+","+x0;
        render();
    }
});
