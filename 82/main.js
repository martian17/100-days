var canvas = document.createElement("canvas");
var width = 700;
var height = 500;
canvas.width = width;
canvas.height = height;
document.body.appendChild(canvas);
var ctx = canvas.getContext("2d");


var n = 10000;
var points = [];
for(var i = 0; i < n; i++){
    points[i] = [Math.random()*width,Math.random()*height];
}


var main = function(points){
    var len = points.length;
    var pmeta = [];
    for(var i = 0; i < len; i++){
        pmeta[i] = [points[i],i,[0,0]];//index in xs and ys
    }
    //sort points
    //small to large
    var xs = [...pmeta].sort((a,b)=>a[0][0]-b[0][0]);
    var ys = [...pmeta].sort((a,b)=>a[0][1]-b[0][1]);
    console.log(JSON.stringify(xs));
    console.log(JSON.stringify(ys));
    for(var i = 0; i < len; i++){
        xs[i][2][0] = i;
        ys[i][2][1] = i;
    }
    var triangulation = divideAndConquer(xs,ys);
    console.log(triangulation);
};





var divideAndConquer = function(xs,ys){
    var len = xs.length;

    var xmin = xs[0][0][0];
    var xmax = xs[len-1][0][0];
    var ymin = ys[0][0][1];
    var ymax = ys[len-1][0][1];
    var len1 = Math.floor(len/2);
    console.log(xmin,ymin,xmax-xmin,ymax-ymin);
    ctx.strokeRect(xmin,ymin,xmax-xmin,ymax-ymin);

    if(len <= 3){//generate triangles
        var edges = [];
        var faces = [];
        for(var i = 0; i < len; i++){
            ctx.beginPath();
            ctx.arc(xs[i][0][0],xs[i][0][1],5,0,6.28);
            ctx.closePath();
            //ctx.stroke();
        }
        console.log(xs,ys);
        return xs;
    }

    var xs1 = [];
    var ys1 = [];
    var xs2 = [];
    var ys2 = [];

    if(xmax-xmin > ymax-ymin){//x longer, divide through x
        console.log("ping1");
        var idx = 0;
        for(var i = 0; i < len; i++){
            if(ys[i][2][0] < len1){
                ys[i][2][1] = idx;
                ys1[idx] = ys[i];
                idx++;
            }
        }
        for(var i = 0; i < len1; i++){
            xs[i][2][0] = i;
            xs1[i] = xs[i];
        }
        var idx = 0;
        for(var i = 0; i < len; i++){
            if(ys[i][2][0] >= len1){
                ys[i][2][1] = idx;
                ys2[idx] = ys[i];
                idx++;
            }
        }
        for(var i = len1; i < len; i++){
            xs[i][2][0] = i-len1;
            xs2[i-len1] = xs[i];
        }
        return [divideAndConquer(xs1,ys1),divideAndConquer(xs2,ys2)];
    }
    else{//divide through y
        console.log("ping2");
        var idx = 0;
        for(var i = 0; i < len; i++){
            if(xs[i][2][1] < len1){
                xs[i][2][0] = idx;
                xs1[idx] = xs[i];
                idx++;
            }
        }
        for(var i = 0; i < len1; i++){
            ys[i][2][1] = i;
            ys1[i] = ys[i];
        }
        var idx = 0;
        for(var i = 0; i < len; i++){
            if(xs[i][2][1] >= len1){
                xs[i][2][0] = idx;
                xs2[idx] = xs[i];
                idx++;
            }
        }
        for(var i = len1; i < len; i++){
            ys[i][2][1] = i-len1;
            ys2[i-len1] = ys[i];
        }
        return [divideAndConquer(xs1,ys1),divideAndConquer(xs2,ys2)];
    }
};

main(points);