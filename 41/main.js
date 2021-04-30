var canvas = document.createElement("canvas");
document.body.appendChild(canvas);

var width = 500;
var height = 500;

canvas.width = width;
canvas.height = height;

var ctx = canvas.getContext("2d");



var start = 1;
var end = 10;
var steps = 400;
var dx = (end-start)/steps;
var y = 3;

var render = function(){
    startLine(start,y);
    for(var i = 0; i < steps; i++){
        var x = start+(end-start)*i/steps;
        var dydx = 0.5*y/x;
        console.log(x,y,dydx);
        y += dydx*dx;
        plot(x,y);
    }
    ctx.stroke();
}


fieldx = 0;
fieldy = 0;
fieldWidth = 10;
fieldHeight = 10;

var startLine = function(xq,yq){
    console.log(xq,yq);
    yq = height-(yq-fieldy)/fieldHeight*height;
    xq = (xq-fieldx)/fieldWidth*width;
    ctx.beginPath();
    console.log(xq,yq);
    ctx.moveTo(xq,yq);
};

var plot = function(xq,yq){
    console.log(xq,yq);
    yq = height-(yq-fieldy)/fieldHeight*height;
    xq = (xq-fieldx)/fieldWidth*width;
    console.log(xq,yq);
    ctx.lineTo(xq,yq);
};

render();

