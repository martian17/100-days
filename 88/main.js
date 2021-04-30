var canvas = document.createElement("canvas");
var width = 200;
var height = 100;
canvas.width = width;
canvas.height = height;
document.body.appendChild(canvas);
var ctx = canvas.getContext("2d");

var imageData = ctx.getImageData(0,0,width,height);

var Idx = function(x,y){
    x = (x+width*10)%width;
    y = (y+height*10)%height;
    return y*width+x;
};

var arr = [];
var shadow = [];
for(var i = 0; i < width*height; i++){
    arr[i] = [0,0,1];//vx,vy,pressure
    shadow[i] = [0,0,0];//vx,vy,pressure
}
for(var y = 0; y < height; y++){
    for(var x = 0; x < width; x++){
        if(/*(10 < x && x < 2000) &&*/ (30 < y && y < 40)){
            arr[Idx(x,y)] = [1,0,0.1];
        }
    }
}


var put = function(cell,pressure,vx,vy){
    var w1 = cell[2];
    var w2 = pressure;
    cell[2] = w1+w2;
    if(w1+w2 > 0){
        cell[0] = (cell[0]*w1+vx*w2)/(w1+w2);
        cell[1] = (cell[1]*w1+vy*w2)/(w1+w2);
    }
};

var step = function(){
    for(var i = 0; i < shadow.length; i++){
        shadow[i] = [0,0,0];
    }
    for(var y = 0; y < height; y++){
        for(var x = 0; x < width; x++){
            var idx = Idx(x,y);
            //look at 4 adjacent cells, calculate the gradient, disparse
            var self = arr[Idx(x,y)];
            var top = arr[Idx(x,y-1)];
            var btm = arr[Idx(x,y+1)];
            var lft = arr[Idx(x-1,y)];
            var rit = arr[Idx(x+1,y)];
            //calculate relatve pressures
            var pressure1 = [
                top[1]+top[2],
                -btm[1]+btm[2],
                lft[0]+lft[2],
                -rit[0]+rit[2],
            ];
            var pressure0 = [
                -self[1]+self[2],
                self[1]+self[2],
                -self[0]+self[2],
                self[0]+self[2],
            ];

            var pressure = [];
            var sum = 0;
            for(var i = 0; i < 4; i++){
                pressure[i] = (pressure0[i]-pressure1[i])/100;
                if(pressure[i] < 0){
                    pressure[i] = 0;
                }
                sum += pressure[i];
            }

            put(shadow[Idx(x,y)],self[2]-sum,self[0],self[1]);
            put(shadow[Idx(x,y-1)],pressure[0],0,-1);
            put(shadow[Idx(x,y+1)],pressure[1],0,1);
            put(shadow[Idx(x-1,y)],pressure[2],-1,0);
            put(shadow[Idx(x+1,y)],pressure[3],1,0);
        }
    }
    var temp = shadow;
    shadow = arr;
    arr = temp;
};


var render = function(){
    var data = imageData.data;
    for(var i = 0; i < arr.length; i++){
        data[i*4+0] = Math.abs(Math.floor(arr[i][0]*255));
        data[i*4+1] = Math.abs(Math.floor(arr[i][1]*255));
        data[i*4+2] = Math.abs(Math.floor(arr[i][2]*255));
        data[i*4+3] = 255;
    }
    ctx.putImageData(imageData,0,0);
}


var animate = function(){
    step();
    render();
    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);




