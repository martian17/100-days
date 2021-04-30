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
    var table1 = [];
    var table2 = [];
    var table3 = [];
    var stride = Math.sqrt(width*height/points.length)*4;
    var offset = stride/2;

    var tableWidth = Math.ceil(width/stride)+1;
    var tableHeight = Math.ceil(height/stride)+1;
    var tableLength = tableWidth*tableHeight;

    for(var i = 0; i < tableLength; i++){
        table[i] = [];
        table1[i] = [];
        table2[i] = [];
        table3[i] = [];
    }

    for(var i = 0; i < points.length; i++){
        table [Math.floor((points[i][0]       )/stride)+Math.floor((points[i][1]       )/stride)*tableWidth].push(points[i]);
        table1[Math.floor((points[i][0]+offset)/stride)+Math.floor((points[i][1]       )/stride)*tableWidth].push(points[i]);
        table2[Math.floor((points[i][0]+offset)/stride)+Math.floor((points[i][1]+offset)/stride)*tableWidth].push(points[i]);
        table3[Math.floor((points[i][0]       )/stride)+Math.floor((points[i][1]+offset)/stride)*tableWidth].push(points[i]);
    }


    console.log(table);
    console.log(table1);
    console.log(table2);
    console.log(table3);
    console.log(stride);
    this.findClosestPoint = function(x,y){

        //tabl3
        var xidx = Math.floor(x/stride);
        var yidx = Math.floor((y+offset)/stride);
        var min = Math.min(x - xidx*stride, (xidx+1)*stride - x, (y+offset) - yidx*stride, (yidx+1)*stride - (y+offset));
        var mindist = Infinity;
        var minpoint;
        var box = table3[xidx+yidx*tableWidth];
        for(var k = 0; k < box.length; k++){
            var dist = dist2(box[k][0]-x,box[k][1]-y);
            if(dist < mindist){
                mindist = dist;
                minpoint = box[k];
            }
        }
        if(mindist < min*min){
            //stats["t3"]++;
            //console.log(mindist,minpoint);
            return minpoint;
        }
        //table2
        var xidx = Math.floor((x+offset)/stride);
        var yidx = Math.floor((y+offset)/stride);
        var min = Math.min((x+offset) - xidx*stride, (xidx+1)*stride - (x+offset), (y+offset) - yidx*stride, (yidx+1)*stride - (y+offset));
        var mindist = Infinity;
        var minpoint;
        var box = table2[xidx+yidx*tableWidth];
        for(var k = 0; k < box.length; k++){
            var dist = dist2(box[k][0]-x,box[k][1]-y);
            if(dist < mindist){
                mindist = dist;
                minpoint = box[k];
            }
        }
        if(mindist < min*min){
            //stats["t2"]++;
            //console.log(mindist,minpoint);
            return minpoint;
        }
        //console.log(mindist,minpoint,min);
        //table1
        var xidx = Math.floor((x+offset)/stride);
        var yidx = Math.floor(y/stride);
        var min = Math.min((x+offset) - xidx*stride, (xidx+1)*stride - (x+offset), y - yidx*stride, (yidx+1)*stride - y);
        var mindist = Infinity;
        var minpoint;
        var box = table1[xidx+yidx*tableWidth];
        for(var k = 0; k < box.length; k++){
            var dist = dist2(box[k][0]-x,box[k][1]-y);
            if(dist < mindist){
                mindist = dist;
                minpoint = box[k];
            }
        }
        if(mindist < min*min){
            //stats["t1"]++;
            //console.log(mindist,minpoint);
            return minpoint;
        }
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

        var searchArea = 1;

        var cnt = 0;
        while(true){
            //if(cnt > 5)break;
            cnt++;
            var mindistArea = mindist + searchArea*stride;
            var mindistArea2 = mindistArea*mindistArea;

            //circling throgh four edges
            //top edge
            var gridCoord;
            gridCoord = yidx-searchArea;
            if(gridCoord >= 0){
                for(var i = xidx-searchArea; i < xidx+searchArea+1; i++){
                    var idx = i+gridCoord*tableWidth;
                    if(idx in table){
                        var box = table[idx];
                        for(var k = 0; k < box.length; k++){
                            var point = box[k];
                            var distp2 = dist2(point[0]-x,point[1]-y);
                            if(distp2 < mindist){
                                mindist = distp2;
                                minpoint = point;
                            }
                        }
                    }
                }
            }
            //bottom edge
            gridCoord = yidx+searchArea;
            if(gridCoord < tableHeight){
                for(var i = xidx-searchArea; i < xidx+searchArea+1; i++){
                    var idx = i+gridCoord*tableWidth;
                    if(idx in table){
                        var box = table[idx];
                        for(var k = 0; k < box.length; k++){
                            //console.log("ping");
                            var point = box[k];
                            var distp2 = dist2(point[0]-x,point[1]-y);
                            if(distp2 < mindist){
                                mindist = distp2;
                                minpoint = point;
                            }
                        }
                    }
                }
            }
            //left edge
            gridCoord = xidx-searchArea;
            if(gridCoord >= 0){
                for(var i = yidx-searchArea+1; i < yidx+searchArea; i++){
                    var idx = gridCoord+tableWidth*i;
                    if(idx in table){
                        var box = table[idx];
                        for(var k = 0; k < box.length; k++){
                            //console.log("ping");
                            var point = box[k];
                            var distp2 = dist2(point[0]-x,point[1]-y);
                            if(distp2 < mindist){
                                mindist = distp2;
                                minpoint = point;
                            }
                        }
                    }
                }
            }
            //right edge
            gridCoord = xidx+searchArea;
            if(gridCoord >= 0){
                for(var i = yidx-searchArea+1; i < yidx+searchArea; i++){
                    var idx = gridCoord+tableWidth*i;
                    if(idx in table){
                        var box = table[idx];
                        for(var k = 0; k < box.length; k++){
                            //console.log("ping");
                            var point = box[k];
                            var distp2 = dist2(point[0]-x,point[1]-y);
                            if(distp2 < mindist){
                                mindist = distp2;
                                minpoint = point;
                            }
                        }
                    }
                }
            }

            searchArea++;
            if(mindist < mindistArea2){
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
