var canvas = document.createElement("canvas");
var width = 1000;
var height = 500;
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
var len = 3000;
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
    var x = Math.random()*width;
    var y = Math.random()*height;
    //var col = gradient([228,0,255],[91,23,255],y/height);
    //var col = gradient([225,175,125],[134,101,76],y/height);
    var col = gradient([225,255,255],[0,0,0],y/height);
    var point = [x,y,col];
    points.push(point);
    grid[Math.floor(y/gridLen)][Math.floor(x/gridLen)].push(point);
}


var calcs = 0;
var dist2 = function(a,b){
    calcs++;
    var c = b[0]-a[0];
    var d = b[1]-a[1];
    return c*c+d*d;
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

var closestPoint = function(x,y){
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
        var distp2 = dist2(point,[x,y]);
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
                        var distp2 = dist2(point,[x,y]);
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
                        var distp2 = dist2(point,[x,y]);
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
                        var distp2 = dist2(point,[x,y]);
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
                        var distp2 = dist2(point,[x,y]);
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



var data = imageData.data;
for(var y = 0; y < height; y++){
    for(var x = 0; x < width; x++){
        var idx = (y*width+x)*4;
        var point = closestPoint(x,y);
        //if(x === 10 && y === 10)console.log(point,idx,point[2][0]);
        data[idx+0] = point[2][0];
        data[idx+1] = point[2][1];
        data[idx+2] = point[2][2];
        data[idx+3] = 255;
    }
}

ctx.putImageData(imageData,0,0);

console.log(calcs);

/*


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
*/



