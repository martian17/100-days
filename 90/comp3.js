/*
var stats = {
    t3:0,
    t2:0,
    t1:0,
    t0:0,
    1:0,
    2:0,
    3:0,
    4:0,
    5:0,
    6:0,
    7:0,
    8:0,
    9:0,
    10:0,
    11:0,
    12:0,
    13:0,
    14:0,
    15:0,
    16:0,
    17:0,
    18:0,
    19:0,
    20:0,
};//iterations
*/

var ClosestPoint = function(points,width,height){
    //all tables are out of alignment, providing maximum coverage
    var table = [];
    var stride = Math.sqrt(width*height/points.length)*4;
    var offset = stride/2;

    var tableWidth = Math.ceil(width/stride)+1;
    var tableHeight = Math.ceil(height/stride)+1;
    var tableLength = tableWidth*tableHeight;

    for(var i = 0; i < tableLength; i++){
        table[i] = [];
    }

    for(var i = 0; i < points.length; i++){
        table [Math.floor((points[i][0]       )/stride)+Math.floor((points[i][1]       )/stride)*tableWidth].push(points[i]);
    }


    console.log(table);
    console.log(stride);
    this.findClosestPoint = function(x,y){
        //table
        var xidx = Math.floor(x/stride);
        var yidx = Math.floor(y/stride);
        var min = Math.min(x - xidx*stride, (xidx+1)*stride - x, y - yidx*stride, (yidx+1)*stride - y);
        var mindist = Infinity;
        var minpoint;
        var box = table[xidx+yidx*tableWidth];
        for(var k = 0; k < box.length; k++){
            var dist = dist2(box[k][0]-x,box[k][1]-y);
            if(dist < mindist){
                mindist = dist;
                minpoint = box[k];
            }
        }
        if(mindist < min*min){
            //stats["t0"]++;
            //console.log(mindist,minpoint);
            return minpoint;
        }

        for(i = 1; i < (width+height)/stride+2; i++){
            //looping through perimeter
            //four corners
            /*
            +  +  -
            =  .  -
            =  *  *
            */
            //if in the zone at all
            var leftin = xidx-i > -1;
            var rightin = xidx+i < tableWidth;
            var topin = yidx-i > -1;
            var bottomin = yidx+i < tableHeight;
            //possible location for branchless execution

            if(topin){
                var yidx1 = yidx-i;
                for(var xidx1 = leftin?xidx-i:0; xidx1 < (rightin?xidx+i:tableWidth); xidx1++){
                    var box = table[xidx1+yidx1*tableWidth];
                    for(var k = 0; k < box.length; k++){
                        var dist = dist2(box[k][0]-x,box[k][1]-y);
                        if(dist < mindist){
                            mindist = dist;
                            minpoint = box[k];
                        }
                    }
                }
            }
            if(bottomin){
                var yidx1 = yidx+i;
                //console.log(11111);
                //console.log(yidx1);
                //console.log(leftin?xidx-i+1:0,rightin?xidx+i+1:tableWidth);
                for(var xidx1 = leftin?xidx-i+1:0; xidx1 < (rightin?xidx+i+1:tableWidth); xidx1++){
                    //console.log(xidx1);
                    var box = table[xidx1+yidx1*tableWidth];
                    //console.log(box);
                    for(var k = 0; k < box.length; k++){
                        var dist = dist2(box[k][0]-x,box[k][1]-y);
                        if(dist < mindist){
                            mindist = dist;
                            minpoint = box[k];
                        }
                    }
                }
            }
            if(leftin){
                var xidx1 = xidx-i;
                for(var yidx1 = topin?yidx-i+1:0; yidx1 < (bottomin?yidx+i+1:tableHeight); yidx1++){
                    var box = table[xidx1+yidx1*tableWidth];
                    for(var k = 0; k < box.length; k++){
                        var dist = dist2(box[k][0]-x,box[k][1]-y);
                        if(dist < mindist){
                            mindist = dist;
                            minpoint = box[k];
                        }
                    }
                }
            }
            if(rightin){
                var xidx1 = xidx+i;
                for(var yidx1 = topin?yidx-i:0; yidx1 < (bottomin?yidx+i:tableHeight); yidx1++){
                    var box = table[xidx1+yidx1*tableWidth];
                    for(var k = 0; k < box.length; k++){
                        var dist = dist2(box[k][0]-x,box[k][1]-y);
                        if(dist < mindist){
                            mindist = dist;
                            minpoint = box[k];
                        }
                    }
                }
            }
            //finally after a full circle, check if there is a point that matches the requirements
            //console.log(mindist,minpoint,min+i*stride);
            if(mindist < (min+i*stride)*(min+i*stride)){
                //stats[i]++;
                //console.log(mindist,minpoint);
                return minpoint;
            }
        }
    }
}


var canvas = document.createElement("canvas");
var width = 6000;
var height = 3000;
canvas.width = width;
canvas.height = height;
document.body.appendChild(canvas);
var ctx = canvas.getContext("2d");

var imageData = ctx.getImageData(0,0,width,height);

var gradient = function(st,ed,t){
    var arr = [];
    for(var i = 0; i < st.length; i++){
        arr[i] = Math.floor(st[i]+(ed[i]-st[i])*t);
    }
    return arr;
};

var points = [];
var len = 30000;

for(var i = 0; i < len; i++){
    var x = Math.random()*width;
    var y = Math.random()*height;
    var col = gradient([225,255,255],[0,0,0],y/height);
    var point = [x,y,col];
    points.push(point);
}


var calcs = 0;
var dist2 = function(a,b){
    calcs++;
    return a*a+b*b;
}

var min = function(){
    var m = Infinity;
    for(var i = 0; i < arguments.length; i++){
        if(arguments[i] < m){
            m = arguments[i];
        }
    }
    return m;
};

var finder = new ClosestPoint(points,width,height);

var data = imageData.data;
for(var y = 0; y < height; y++){
    for(var x = 0; x < width; x++){
        var idx = (y*width+x)*4;
        var point = finder.findClosestPoint(x,y);
        //if(x === 10 && y === 10)console.log(point,idx,point[2][0]);
        data[idx+0] = point[2][0];
        data[idx+1] = point[2][1];
        data[idx+2] = point[2][2];
        data[idx+3] = 255;
    }
}

ctx.putImageData(imageData,0,0);

console.log(calcs);
