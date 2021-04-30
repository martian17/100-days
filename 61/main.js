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
    var h = 10;
    var gra = [];
    var itn = [];
    for(var i = 0; i < h; i++){
        for(var j = 0; j < w; j++){
            var idx = i*w+j;
            var r = Math.random();
            var rad = Math.random()*Math.PI/2;
            gra[idx] = [r*Math.cos(rad),r*Math.sin(rad)];
            //gra[idx] = [Math.random()*2-1,Math.random()*2-1];
            itn[idx] = 0;//Math.random()*2-1;
        }
    }
    var data0 = bicubic(itn,gra,w,h,width,height).map(
        function(intensity){
            return color(intensity+0.5);
        }
    );
    for(var i = 0; i < width*height; i++){
        data[i*4+0] = data0[i][0];
        data[i*4+1] = data0[i][1];
        data[i*4+2] = data0[i][2];
        data[i*4+3] = data0[i][3];
    }
    ctx.putImageData(IDT,0,0);
}

render();
