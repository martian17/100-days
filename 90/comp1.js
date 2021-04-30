var ClosestPoint = function(points,width,height){
    var len = points.length;
    //init grid
    var gridLen = Math.sqrt(width*height/len)*1;
    var gridWidth = width/gridLen+1;
    var gridHeight = height/gridLen+1;
    var grid = [];
    for(var i = 0; i < gridHeight; i++){
        grid[i] = [];
        for(var j = 0; j < gridWidth; j++){
            grid[i][j] = [];
        }
    }
    for(var i = 0; i < len; i++){
        var point = points[i];
        var x = point[0];
        var y = point[1];
        grid[Math.floor(y/gridLen)][Math.floor(x/gridLen)].push(point);
    }

    this.findClosestPoint = function(x,y){
        var gridX = Math.floor(x/gridLen);
        var gridY = Math.floor(y/gridLen);

        var mindist = min(
            x-gridX*gridLen,
            (gridX+1)*gridLen-x,
            y-gridY*gridLen,
            (gridY+1)*gridLen-y
        );
        //console.log(mindist);

        var minPoint = false;
        var mindis = Infinity;
        //common case, in one square
        var mindistArea2 = mindist*mindist;
        var box = grid[gridY][gridX];
        for(var k = 0; k < box.length; k++){
            //console.log("ping");
            var point = box[k];
            var distp2 = dist2(point[0]-x,point[1]-y);
            if(distp2 < mindis){
                mindis = distp2;
                minPoint = point;
            }
        }
        if(mindis < mindistArea2){
            return minPoint;
        }


        var searchArea = 1;

        var cnt = 0;
        while(true){
            //if(cnt > 5)break;
            cnt++;
            var mindistArea = mindist + searchArea*gridLen;
            var mindistArea2 = mindistArea*mindistArea;

            //circling throgh four edges
            //top edge
            var gridCoord;
            gridCoord = gridY-searchArea;
            if(gridCoord >= 0){
                for(var i = gridX-searchArea; i < gridX+searchArea+1; i++){
                    if(i in grid[gridCoord]){
                        var box = grid[gridCoord][i];
                        for(var k = 0; k < box.length; k++){
                            var point = box[k];
                            var distp2 = dist2(point[0]-x,point[1]-y);
                            if(distp2 < mindis){
                                mindis = distp2;
                                minPoint = point;
                            }
                        }
                    }
                }
            }
            //bottom edge
            gridCoord = gridY+searchArea;
            if(gridCoord < gridHeight){
                for(var i = gridX-searchArea; i < gridX+searchArea+1; i++){
                    if(i in grid[gridCoord]){
                        var box = grid[gridCoord][i];
                        for(var k = 0; k < box.length; k++){
                            //console.log("ping");
                            var point = box[k];
                            var distp2 = dist2(point[0]-x,point[1]-y);
                            if(distp2 < mindis){
                                mindis = distp2;
                                minPoint = point;
                            }
                        }
                    }
                }
            }
            //left edge
            gridCoord = gridX-searchArea;
            if(gridCoord >= 0){
                for(var i = gridY-searchArea+1; i < gridY+searchArea; i++){
                    if(i in grid && gridCoord in grid[i]){
                        var box = grid[i][gridCoord];
                        for(var k = 0; k < box.length; k++){
                            //console.log("ping");
                            var point = box[k];
                            var distp2 = dist2(point[0]-x,point[1]-y);
                            if(distp2 < mindis){
                                mindis = distp2;
                                minPoint = point;
                            }
                        }
                    }
                }
            }
            //right edge
            gridCoord = gridX+searchArea;
            if(gridCoord >= 0){
                for(var i = gridY-searchArea+1; i < gridY+searchArea; i++){
                    if(i in grid && gridCoord in grid[i]){
                        var box = grid[i][gridCoord];
                        for(var k = 0; k < box.length; k++){
                            //console.log("ping");
                            var point = box[k];
                            var distp2 = dist2(point[0]-x,point[1]-y);
                            if(distp2 < mindis){
                                mindis = distp2;
                                minPoint = point;
                            }
                        }
                    }
                }
            }
            //console.log(searchArea);

            searchArea++;
            if(mindis < mindistArea2){
                break;
            }
        }
        //console.log(minPoint);
        //console.log(mindis);
        //return false;
        return minPoint;
    }
};


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
