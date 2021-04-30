var canvas = document.createElement("canvas");
document.body.appendChild(canvas);

var width = 500;
var height = 500;

canvas.width = width;
canvas.height = height;

var ctx = canvas.getContext("2d");
ctx.fillStyle = "#ffffff05";

var imagedata = ctx.getImageData(0,0,width,height);
var data = imagedata.data;


var field = [];
var field2 = [];

for(var i = 0; i < height; i++){
    field[i] = [];
    field2[i] = [];
    for(var j = 0; j < width; j++){
        field[i][j] = 0;
        field2[i][j] = 0;
    }
}

for(var i = 0; i < height; i++){
    for(var j = 0; j < width; j++){
        var idx = (i*width+j)*4;
        data[idx] = 255;
        data[idx+1] = 0;
        data[idx+2] = 0;
        data[idx+3] = 0;
    }
}

field[0][0] = 1000;
field[230][200] = 100000;


var plot = function(){
    for(var i = 0; i < height; i++){
        for(var j = 0; j < width; j++){
            var col = squash(field[i][j]);//squash to integer 0=<255
            var idx = (i*width+j)*4;
            if(col !== 0){
                //console.log(i,j,col)
            }
            data[idx+3] = col;
        }
    }
};


var render = function(){
    plot();
    ctx.putImageData(imagedata,0,0);
};


var ringx = function(a){
    return (a+width)%width;
}

var ringy = function(a){
    return (a+height)%height;
}

var squash = function(x){
    return Math.floor(255*2/(1+Math.E**(-0.01*x))-255)
}

var start = 0;

var alpha = 10;
var grain = 1;

var animate = function(t){
    if(start === 0)start = t;
    var itv = t-start;
    start = t;

    render();

    //torus
    for(var i = 0; i < height; i++){
        for(var j = 0; j < width; j++){
            var ddx = ((field[i][ringx(j-1)]-field[i][j])-(field[i][j]-field[i][ringx(j+1)]))/grain;
            var ddy = ((field[ringy(i-1)][j]-field[i][j])-(field[i][j]-field[ringy(i+1)][j]))/grain;
            var dT = alpha*(ddx+ddy);
            //if(i===0&&j===1)console.log(field[i][j]);
            //if(i===0&&j===1)console.log(dT);
            //if(i===0&&j===1)console.log(dT*itv/1000+field[i][j]);
            field2[i][j] = dT*itv/1000+field[i][j];
            //if(i===0&&j===1)console.log(field2[i][j]);
        }
    }
    var temp = field;
    field = field2;
    field2 = temp;
    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

