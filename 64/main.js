var canvas = document.createElement("canvas");
document.body.appendChild(canvas);

var width = 1500;
var height = 1500;
canvas.width = width;
canvas.height = height;

var ctx = canvas.getContext("2d");



var createRandGraph = function(n){
    var result = [];
    for(var i = 0; i < n; i++){
        result[i] = [];
    }

    for(var i = 0; i < n; i++){
        for(var j = 0; j < i; j++){
            if(Math.random() > 0.8){
                result[i].push(j);
                result[j].push(i);
            }
        }
    }

    return result;
}


var genArray = function(len){
    var arr = [];
    for(var i = 0; i < len; i++){
        arr.push(i);
    }
    return arr;
};

var dist = function(c1,c2){
    var dx = c2[0]-c1[0];
    var dy = c2[1]-c1[1];
    return Math.sqrt(dx*dx+dy*dy);
};


var firstn = 0;
var adjustCoord = function(coords,vels,alist,dt){
    var nlen = 100;
    var k = 100;
    var len = alist.length;
    for(var i = 0; i < len; i++){
        var p1c = coords[i];
        for(var j = 0; j < alist[i].length; j++){
            var p2c = coords[alist[i][j]];
            var dx = p2c[0]-p1c[0];
            var dy = p2c[1]-p1c[1];
            var dist = Math.sqrt(dx*dx+dy*dy);
            var dd = dist-nlen;
            var fd = dd*k;
            var fdx = fd*dx/dist;
            var fdy = fd*dy/dist;
            vels[i][0] += fdx*dt;
            vels[i][1] += fdy*dt;
        }
    }

    var G = -10000000;
    for(var i = 0; i < len; i++){
        var p1c = coords[i];
        for(var j = 0; j < len; j++){
            if(i === j){
                continue;
            }
            var p2c = coords[j];
            var dx = p2c[0]-p1c[0];
            var dy = p2c[1]-p1c[1];
            var dist2 = dx*dx+dy*dy;
            var dist = Math.sqrt(dist2);
            var fd = G/(dist2);
            var fdx = fd*dx/dist;
            var fdy = fd*dy/dist;

            /*if(firstn < 1000){
                firstn++;
                console.log(fdx,fdy);
            }*/
            vels[i][0] += fdx*dt;
            vels[i][1] += fdy*dt;
        }
    }

    for(var i = 0; i < len; i++){
        vels[i][0] *= 0.9;
        vels[i][1] *= 0.9;
        coords[i][0] += vels[i][0]*dt;
        coords[i][1] += vels[i][1]*dt;
    }

    //no return because modifying
}

var render = function(coords,alist,path){
    ctx.clearRect(0,0,width,height);
    ctx.strokeStyle="#000";
    var len = alist.length;
    for(var i = 0; i < len; i++){
        var p1c = coords[i];
        for(var j = 0; j < alist[i].length; j++){
            var p2c = coords[alist[i][j]];
            ctx.beginPath();
            ctx.moveTo(p1c[0]+width/2,p1c[1]+height/2);
            ctx.lineTo(p2c[0]+width/2,p2c[1]+height/2);
            ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(p1c[0]+width/2,p1c[1]+height/2,10,0,6.28);
        ctx.closePath();
        ctx.stroke();
    }

    ctx.strokeStyle="#f00";
    for(var i = 0; i < path.length-1; i++){
        var p1c = coords[path[i]];
        var p2c = coords[path[i+1]];
        ctx.beginPath();
        ctx.moveTo(p1c[0]+width/2,p1c[1]+height/2);
        ctx.lineTo(p2c[0]+width/2,p2c[1]+height/2);
        ctx.stroke();
    }
};


var alistToJSON = function(alist){
    var obj = {};
    for(var i = 0; i < alist.length; i++){
        obj[i] = alist[i];
    }
    return JSON.stringify(obj);
};

var initAnimation = function(alist,path){
    console.log(alistToJSON(alist));
    var len = alist.length;
    var coords = genArray(len).map(a=>[a*10,Math.random()*10]);
    var vels = genArray(len).map(a=>[0,0]);

    var start = 0;
    var cnt = 0;

    var animate = function(t){
        if(start === 0)start = t;
        var dt = t-start;
        start = t;
        render(coords,alist,path);
        //console.log(JSON.stringify(coords),JSON.stringify(vels));
        adjustCoord(coords,vels,alist,16/1000);//dt/1000);
        cnt++;
        if(cnt === 10){
            //return false;
        }
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
}



var peek = function(arr){
    var ans = arr.pop();
    arr.push(ans);
    return ans;
};

var hamilWrapper = function(alist){
    var path = [0];
    var table = {};
    for(var i = 0; i < alist.length; i++){
        table[i] = false;
    }
    table[0] = true;
    return findHamiltonian(alist,path,table);
};

var findHamiltonian = function(alist,path,table){
    //console.log(path,table);
    var p = peek(path);
    var node = alist[p];
    if(path.length === alist.length){
        for(var i = 0; i < node.length; i++){
            if(node[i] === 0){
                return path.push(0);
            }
        }
        return false;
    }
    for(var i = 0; i < node.length; i++){
        if(table[node[i]] !== true){
            table[node[i]] = true;
            path.push(node[i]);
            var result = findHamiltonian(alist,path,table);
            if(result !== false){
                return path;
            }
            path.pop(node[i]);
            table[node[i]] = false;
        }
    }
    return false;
};

var graph = [
    [1,2,3,4,5,9],
    [0,2,3,4,6,8],
    [0,1,7,8,9],
    [0,1,7],
    [0,1,5,8],
    [0,4,6,7,8],
    [1,5,7,8,9],
    [2,3,5,6,8],
    [1,2,4,5,6,7,9],
    [0,2,6,8]
];

/*var graph = [
    [1,2],
    [2,0],
    [0,1]
];*/

var graph = createRandGraph(20);

//initAnimation(createRandGraph(10),[0,1,2,3]);
initAnimation(graph,hamilWrapper(graph));//,[0,1,2]);
