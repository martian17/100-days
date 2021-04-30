


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


/*dimmap([0,0,0],[2,2,2],function(coord){
    console.log(coord);
});*/

var hash = function(str) {
    var hash = 0;
    if (str.length == 0) {
        return hash;
    }
    for (var i = 0; i < str.length; i++) {
        var char = str.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

var access = function(corner,dim,coords){
    var len = dim.length;
    var relative = [];
    var result = 0;
    var dimProduct = 1;
    for(var i = 0; i < len; i++){
        result += (coords[i]-corner[i])*dimProduct;
        dimProduct *= dim[i];
    }
    return result;
}


var gradient3d = function(corner,dimension){
    //3d loop
    var arr = dimmap(corner,dimension,function(coords,i){
        //coords =
        //Math.random for now
        return coords.map(a=>Math.random());
    });

/*
    dimmap(corner,dimension,function(coords,i){
        //coords =
        //Math.random for now
        //interpolate for each dimensions, and average them
        var gra0 = arr[i]
        for(var i = 0; i < dim; i++){
            //cubic interpolation
            var x0 = 0;
            var x1 = 1;

            var s0 = ;
            var s1 = ;
            console.log(s0,s1);
            var f0 = arr[i][1];
            var f1 = arr[i+1][1];

            var a = 2*f0-2*f1+s0+s1;
            var b = -3*f0+3*f1-2*s0-s1;
            var c = s0;
            var d = f0;


            for(var j = 0; j < 100; j++){
                var x = j/100;
                var y = (a*x*x*x+b*x*x+c*x+d);
                x = x0+(x1-x0)*x;
                ctx.lineTo(x,height-y);
            }
        }
        var idx = access(arr,corner,dim,coords);
    });*/
}


var canvas = document.createElement("canvas");
var width = 500;
var height = 500;
canvas.width = width;
canvas.height = height;
this.canvas = canvas;
document.body.appendChild(canvas);
var ctx = canvas.getContext("2d");

dimmap([10,10],[20,20],function(coord,i){
    console.log(i);
    var x = coord[0]*10;
    var y = coord[1]*10;

    ctx.beginPath();
    ctx.moveTo(x,y);
    ctx.lineTo(x,y+1);
    ctx.stroke();
});
