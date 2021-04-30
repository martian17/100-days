var canvas = document.createElement("canvas");
document.body.appendChild(canvas);

var width = 1000;
var height = 500;

canvas.width = width;
canvas.height = height;

var ctx = canvas.getContext("2d");
ctx.fillStyle = "#ffffff05";

//tictactoe simulation

var x = 250;
var y = 250;
var l = 10;
var th = 1;//angle
var dx = 0;
var dy = 0;
var dth = 0;

var g = 100/1000;//per milisecond2


var start = 0;

var animate = function(t){
    if(start === 0)start = t;
    var dt = t - start;

    dy += g*dt;
    x += 


}

var render = function(){
    clearData();
    var da = (ed-st)/(width-100);

    for(var a = st; a < ed; a+= da){
        x = 0.3;
        for(var i = 0; i < 2000; i++){
            x = a*x*(1-x);
        }
        for(var i = 0; i < 600; i++){
            x = a*x*(1-x);
            plotCoord(a,x);
        }
    }
    ctx.putImageData(imagedata,0,0);
};

render();

