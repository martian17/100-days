var canvas = document.createElement("canvas");
document.body.appendChild(canvas);

var width = 500;
var height = 500;

canvas.width = width;
canvas.height = height;

var ctx = canvas.getContext("2d");



var g = 1000;



/*
var vertices = [
    //[mass x y dx dy,movable]
    [10,200,0,0,false],//mass
    [10,-200,0,0,false]//mass
];

var edges = [
    //[v1 v2 nlength kconstant,k2]
    [2,0,10,10000,100],
    [2,1,10,10000,100]
];


for(var i = 0; i < 1; i++){
    vertices[i+2] = [1,0,-10*i,0,0,true];
    if(i !== 0)edges.push([i+1,i+2,10,100000,100]);
}
vertices[vertices.length-1][5] = false;

*/

/*
var vertices = [
    //[mass x y dx dy,movable]
    [10,0,0,0,0,true],
    [10,0,-100,0,0,true],//mass
    [10,0.0001,-200,0,0,true],//mass
    [10,200,0,0,false],//mass
    [10,-200,0,0,false]//mass

];

var edges = [
    //[v1 v2 nlength kconstant,k2]
    [0,1,100,100000,100],
    [1,2,100,100000,100],
    [0,3,10,100000,10],
    [0,4,10,100000,10],
    //[0,2,160,10000]
];*/

/*
var vertices = [
    //[mass x y dx dy,movable]
    [10,0,0,0,0,true],
    [10,0,150,0,0,true],
    [10,100,0,0,0,true],
    [10,250,0,0,0,true],
    [10,-100,0,10,0,true],
    [10,-100+150*Math.cos(1),0+150*Math.sin(1),10,0,true],
];

var edges = [
    //[v1 v2 nlength kconstant,k2]
    [0,1,100,1000,1],
    [2,3,100,1000,1],
    [4,5,100,1000,1],
    //[0,2,160,10000]
];
g = 0;
*/


var g = 1000;

var calc = function(dt){
    if(dt === 0)return false;
    for(var i = 0; i < edges.length; i++){
        var edge = edges[i];
        var v1 = vertices[edge[0]];
        var v2 = vertices[edge[1]];
        //console.log(edge,v1,v2);
        var nl = edge[2];
        var k = edge[3];
        var k2 = edge[4];
        var dx = v2[1]-v1[1];
        var dy = v2[2]-v1[2];
        var dist2 = dx*dx+dy*dy;
        var dist = Math.sqrt(dist2);
        var dd = dist-nl;

        //spring resistance
        var dvx = v2[3]-v1[3];
        var dvy = v2[4]-v1[4];
        var dldt = (dvx*dx+dvy*dy)/dist;//far plus

        if(v1[5]){
            var acc = (dd*k+dldt*k2)/v1[0];
            //var acc = (dd*k+(dldt>0?k2/dt:-k2/dt))/v1[0];
            var accx = acc*dx/dist;
            var accy = acc*dy/dist;
            v1[3] += accx*dt;
            v1[4] += accy*dt;
        }
        if(v2[5]){
            var acc = (-dd*k-dldt*k2)/v1[0];
            //var acc = (-dd*k-(dldt>0?k2/dt:-k2/dt))/v1[0];
            var accx = acc*dx/dist;
            var accy = acc*dy/dist;
            v2[3] += accx*dt;
            v2[4] += accy*dt;
        }
    }

    for(var i = 0; i < vertices.length; i++){
        if(!vertices[i][5])continue;
        //console.log(vertices[i]);
        vertices[i][4] += g*dt;
        vertices[i][1] += vertices[i][3]*dt;
        vertices[i][2] += vertices[i][4]*dt;
    }
};


var xoffset = 250;
var yoffset = 250;

var render = function(){
    ctx.clearRect(0,0,width,height);
    for(var i = 0; i < edges.length; i++){
        var edge = edges[i];
        var v1 = vertices[edge[0]];
        var v2 = vertices[edge[1]];
        var dx = v2[1]-v1[1];
        var dy = v2[2]-v1[2];
        ctx.beginPath();
        ctx.moveTo(v1[1]+xoffset,v1[2]+yoffset);
        ctx.lineTo(v2[1]+xoffset,v2[2]+yoffset);
        ctx.stroke();
    }

    for(var i = 0; i < vertices.length; i++){
        //ctx.beginPath();
        //ctx.arc(vertices[i][1]+xoffset,vertices[i][2]+yoffset,10,0,6.28);
        //ctx.closePath();
        //ctx.stroke();
    }
};


var start = 0;

var animate = function(t){
    if(start === 0)start = t;
    var itv = t-start;
    start = t;

    var steps = 100;
    for(var i = 0; i < steps; i++){
        calc(itv/steps/1000);
    }

    render();
    requestAnimationFrame(animate);
};



var vertices = [
    //[mass x y dx dy,movable]
    [10,200,0,0,false],//mass
    [10,-200,0,0,false]//mass
];

var edges = [
    //[v1 v2 nlength kconstant,k2]
    [2,0,10,10000,10],
    [2,1,10,10000,10]
];


for(var i = 0; i < 15; i++){
    vertices[i+2] = [1,0,-5*i,0,0,true];
    if(i !== 0)edges.push([i+1,i+2,5,10000,20]);
}
vertices[vertices.length-1][0] = 100000000;
vertices[vertices.length-1][1] = 10;

setTimeout(function(){
    requestAnimationFrame(animate);
},100)
