


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


    dimmap(corner,dimension,function(coords,i){
        //coords =
        //Math.random for now
        //interpolate for each dimensions, and average them
        var gra0 = arr[i];
        //only two dimensional
        var x = coords[0];
        var y = coords[1];
        if(x === dim[0]-1 || y === dim[1]-1){
            return false;
        }
        var tl = arr[i];
        var tr = arr[access(corner,dim,[x+1,y])];
        var bl = arr[access(corner,dim,[x,y+1])];
        var br = arr[access(corner,dim,[x+1,y+1])];
        var a1 = tl+tr;
        var b1 = -2*tl-tr;
        var c1 = tl;

        var a2 = bl+br;
        var b2 = -2*bl-br;
        var c2 = bl;

        var a3 = tl+bl;
        var b3 = -2*tl-bl;
        var c3 = tl;

        var a4 = tr+br;
        var b4 = -2*tr-br;
        var c4 = tr;

        for(var j = 0; j < 10; j++){
            for(var k = 0; k < 10; k++){
                var px = j/10;
                var py = k/10;
                var intensity =
                (a1*(1-py)+a2*py)*px*px*px+(b1*(1-py)+b2*py)*px*px+(c1*(1-py)+c2*py)*px+
                (a3*(1-px)+a4*px)*py*py*py+(b3*(1-px)+b4*px)*py*py+(c3*(1-px)+c4*px)*py;
            }
        }

        /*
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
        var idx = access(arr,corner,dim,coords);*/
    });
}


var canvas = document.createElement("canvas");
var width = 500;
var height = 500;
canvas.width = width;
canvas.height = height;
this.canvas = canvas;
document.body.appendChild(canvas);
var ctx = canvas.getContext("2d");



var corner = [10,10];
var dim = [20,20];

var arr = dimmap(corner,dim,function(coords,i){
    //coords =
    //Math.random for now
    return coords.map(a=>Math.random());
});

dimmap(corner,dim,function(coords,i){
    //coords =
    //Math.random for now
    //interpolate for each dimensions, and average them
    var gra0 = arr[i];
    //only two dimensional
    var x = coords[0];
    var y = coords[1];
    if(x >= dim[0]+corner[0]-1 || y >= dim[0]+corner[1]-1){
        return false;
    }
    var tl = arr[i];
    var tr = arr[access(corner,dim,[x+1,y])];
    var bl = arr[access(corner,dim,[x,y+1])];
    var br = arr[access(corner,dim,[x+1,y+1])];
    var a1 = tl[0]+tr[0];
    var b1 = -2*tl[0]-tr[0];
    var c1 = tl[0];

    var a2 = bl[0]+br[0];
    var b2 = -2*bl[0]-br[0];
    var c2 = bl[0];

    var a3 = tl[1]+bl[1];
    var b3 = -2*tl[1]-bl[1];
    var c3 = tl[1];

    var a4 = tr[1]+br[1];
    var b4 = -2*tr[1]-br[1];
    var c4 = tr[1];

    if(x === 15 && y === 15)console.log(a1,b1,c1,a2,b2,c2,a3,b3,c3,a4,b4,c4);

    for(var j = 0; j < 10; j++){
        for(var k = 0; k < 10; k++){
            var px = j/10;
            var py = k/10;
            var intensity =
            (a1*(1-py)+a2*py)*px*px*px+(b1*(1-py)+b2*py)*px*px+(c1*(1-py)+c2*py)*px+
            (a3*(1-px)+a4*px)*py*py*py+(b3*(1-px)+b4*px)*py*py+(c3*(1-px)+c4*px)*py;

            ctx.beginPath();
            ctx.moveTo(coords[0]*10+j,coords[1]*10+k);
            ctx.lineTo(coords[0]*10+j,coords[1]*10+k+1);
            var col = Math.floor(intensity*200);
            ctx.strokeStyle = "rgb("+col+"+"+col+"+"+col+")";
            ctx.stroke();
        }
    }
});
