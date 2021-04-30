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

var delaunay = function(Points,points){
    if(points.length < 3){
        return false;
    }
    var faces = [[points[0][1],points[1][1],points[2][1]]];
    for(var i = 3; i < points.length; i++){
        //add point to edge
        var point = points[i];
        var coords = point[0];
        for(var j = 0; j < faces.length; j++){
            var face = faces[i];
            var c1 = Points[face[0]];
            var c2 = Points[face[1]];
            var c3 = Points[face[2]];

        }

    }
}
