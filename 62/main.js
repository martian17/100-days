var canvas = document.createElement("canvas");
document.body.appendChild(canvas);

var width = 500;
var height = 500;
canvas.width = width;
canvas.height = height;

var ctx = canvas.getContext("2d");
var IDT = ctx.getImageData(0,0,width,height);
var data = IDT.data;

var color = function(val){
    /*return [
        Math.floor(255*val),
        Math.floor(255*(1-val)),
        Math.floor(55*val),
        255
    ];*/
    return [
        0,
        0,
        0,
        Math.floor(255*val),
    ];
}


var render = function(){
    var w = 10;
    var slo = [];
    var itn = [];
    for(var i = 0; i < w; i++){
            slo[i] = Math.random()*2-1;
            itn[i] = Math.random()*2-1;
    }
    var result = cubic1d(itn,slo,w,500);

    ctx.beginPath();
    ctx.moveTo(0,height/2-result[0]*100);
    for(var i = 0; i < result.length; i++){
        ctx.lineTo(i,height/2-result[i]*100);
    }
    ctx.strokeStyle = "#f00";
    ctx.stroke();


    var result = cubic1dd(itn,slo,w,500);

    ctx.beginPath();
    ctx.moveTo(0,height/2-result[0]*50);
    for(var i = 0; i < result.length; i++){
        ctx.lineTo(i,height/2-result[i]*50);
    }
    ctx.strokeStyle = "#0f0";
    ctx.stroke();
}

render();
