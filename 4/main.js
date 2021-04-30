

var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");



var Scene = function(){

    var rotate2d = function(xy,angle){
        var sin = Math.sin(angle);
        var cos = Math.cos(angle);
        var x1 = xy[0]*cos-xy[1]*sin;
        var y1 = xy[0]*sin+xy[1]*cos;
        return [x1,y1];
    };
    var translate = function(coord,camera){
        //camera facing +y axis
        var x = coord[0]-camera[0];
        var y = coord[1]-camera[1];
        var z = coord[2]-camera[2];
        var xy1 = rotate2d([x,y],-camera[3]);
        x = xy1[0];
        y = xy1[1];
        var yz1 = rotate2d([y,z],-camera[4]);
        y = yz1[0];
        z = yz1[1];
        //xz is the screen
        //when displayed at 1
        if(y <= 0){//behind camera
            return false;
        }
        var x2 = x/y;
        var y2 = z/y;


        return rotate2d([x2,y2],camera[5]);
    };//screen is at distance 1

    this.shapes = [];
    this.add = function(dots){
        this.shapes.push(dots);
    };

    var canvas = document.createElement("canvas");
    canvas.width = 1500;
    canvas.height = 1500;
    var ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.ctx = ctx;
    this.render = function(camera){
        //camera: x y z xy yz scrot
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.strokeStyle = "#f00";
        ctx.beginPath();
        ctx.moveTo(250,250);
        ctx.lineTo(250,253);
        ctx.stroke();
        ctx.strokeStyle = "#000";
        for(var i = 0; i < this.shapes.length; i++){
            var dots = this.shapes[i];
            for(var j = 0; j < dots.length; j++){
                var dot = dots[j];
                coord = translate(dot,camera);
                if(coord === false)continue;
                coord = [coord[0]*500+250,coord[1]*500+250];
                ctx.beginPath();
                ctx.moveTo(coord[0],500-coord[1]);
                ctx.lineTo(coord[0],500-coord[1]+1);
                ctx.stroke();
            }
        }
    };
}



var parsePlyDot = function(ply){
    var dots = ply.split("\n").map(a=>{
        return a.split(" ");
    }).filter(a=>{
        return a.length === 3;
    }).map(a=>{
        return [parseFloat(a[0]),parseFloat(a[1]),parseFloat(a[2])];
    }).filter(a=>{
        if(!isNaN(a[0]) && !isNaN(a[1]) && !isNaN(a[2])){
            return true;
        }
        return false;
    });
    return dots;
};

var dots = parsePlyDot(bunny2);
var scene = new Scene();
document.body.appendChild(scene.canvas);
scene.add(dots);
scene.render([0,-0.1,0,0,0,0]);
var n = 0;
var m = 0;
var r = 0.4;
setInterval(function(){
    n+=0.05*2;
    m = Math.sin(n*3)/5;
    scene.render([r*Math.cos(n)*Math.cos(m),r*Math.sin(n)*Math.cos(m),r*Math.sin(m),n+Math.PI/2,-m,0]);
},100);


