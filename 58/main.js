var dimmap = function(corner,dimension,callback){
    var coords = corner.map(a=>a);
    var len = corner.length;
    var result = [];
    var counter = 0;
    while(true){
        result.push(callback(coords,counter));
        counter++;
        coords[0]++;
        for(var i = 0; i < len-1; i++){
            if(coords[i] > corner[i]+dimension[i]){
                coords[i] = corner[i];
                coords[i+1]++;
            }else{
                break;
            }
        }
        if(coords[len-1] > corner[len-1]+dimension[len-1]){
            break;
        }
    }
    return result;
};



var canvasM = body.add("canvas");
var canvas = canvasM.e;

var width = 500;
var height = 500;
canvas.width = width;
canvas.height = height;

var ctx = canvas.getContext("2d");
var IDT = ctx.getImageData(0,0,width,height);
var data = IDT.data;

var noise = blur(width,height,30);


var color = function(val){
    return [
        Math.floor(255*val),
        Math.floor(255*(1-val)),
        Math.floor(55*val),
        255
    ];
}

for(var i = 0; i < noise.length; i++){
    var col = color(noise[i]);
    if(i === 959){
        console.log(col);
    }
    data[i*4+0] = col[0];
    data[i*4+1] = col[1];
    data[i*4+2] = col[2];
    data[i*4+3] = col[3];
    //data[i*4+3] = Math.floor(noise[i]*256);
}





ctx.putImageData(IDT,0,0);

ctx.strokeStyle = "#00ff00";
var threshold = 0.5;
console.log(threshold);
for(var threshold = 0; threshold < 1; threshold+=0.1){
    for(var i = 0; i < height-1; i++){
        for(var j = 0; j < width-1; j++){
            var tl = noise[i*width+j]>threshold;
            var tr = noise[i*width+j+1]>threshold;
            var bl = noise[(i+1)*width+j]>threshold;
            var br = noise[(i+1)*width+j+1]>threshold;
            if((tl && tr && bl && br) || (!tl && !tr && !bl && !br)){
                //do nothing
            }else if((!tl && tr && bl && br) || (tl && !tr && !bl && !br)){
                ctx.beginPath()
                ctx.moveTo(j,i+0.5);
                ctx.lineTo(j+0.5,i);
                ctx.stroke();
            }else if((tl && !tr && bl && br) || (!tl && tr && !bl && !br)){
                ctx.beginPath()
                ctx.moveTo(j+0.5,i);
                ctx.lineTo(j+1,i+0.5);
                ctx.stroke();
            }else if((tl && tr && !bl && br) || (!tl && !tr && bl && !br)){
                ctx.beginPath()
                ctx.moveTo(j+1,i+0.5);
                ctx.lineTo(j+0.5,i+1);
                ctx.stroke();
            }else if((tl && tr && bl && !br) || (!tl && !tr && !bl && br)){
                ctx.beginPath()
                ctx.moveTo(j+0.5,i+1);
                ctx.lineTo(j,i+0.5);
                ctx.stroke();
            }else if((tl && tr && !bl && !br) || (!tl && !tr && bl && br)){
                ctx.beginPath()
                ctx.moveTo(j,i+0.5);
                ctx.lineTo(j+1,i+0.5);
                ctx.stroke();
            }else if((tl && !tr && bl && !br) || (!tl && tr && !bl && br)){
                ctx.beginPath()
                ctx.moveTo(j+0.5,i);
                ctx.lineTo(j+0.5,i+1);
                ctx.stroke();
            }else if((tl && !tr && !bl && br) || (!tl && tr && bl && !br)){
                ctx.beginPath()
                ctx.moveTo(j+0.5,i);
                ctx.lineTo(j+0.5,i+1);
                ctx.stroke();
                ctx.beginPath()
                ctx.moveTo(j,i+0.5);
                ctx.lineTo(j+1,i+0.5);
                ctx.stroke();
            }

        }
    }
}
