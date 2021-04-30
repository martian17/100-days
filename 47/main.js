


var canvasM = body.add("canvas");
var canvas = canvasM.e;

var width = 500;
var height = 500;
canvas.width = width;
canvas.height = height;

var ctx = canvas.getContext("2d");
var IDT = ctx.getImageData(0,0,width,height);
var data = IDT.data;

var noise = noiseGenerator([width,height],30);

for(var i = 0; i < noise.length; i++){
    data[i*4+3] = Math.floor(noise[i]*256);
}
ctx.putImageData(IDT,0,0);
