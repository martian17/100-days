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
    this.add = function(poly){
        this.shapes.push(poly);
    };

    var canvas = document.createElement("canvas");
    canvas.width = 1500;
    canvas.height = 1500;
    var ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.ctx = ctx;
    this.render = function(camera){
        var width = canvas.width;
        var height = canvas.height;
        //camera: x y z xy yz scrot
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.strokeStyle = "#f00";
        ctx.beginPath();
        ctx.moveTo(width/2,height/2);
        ctx.lineTo(width/2,height/2+3);
        ctx.stroke();
        ctx.strokeStyle = "#000";
        for(var i = 0; i < this.shapes.length; i++){
            var poly = this.shapes[i];
            var verts = poly[0];
            var faces = poly[1];
            for(var j = 0; j < faces.length; j++){
                var face = faces[j]
                ctx.beginPath();
                for(var k = 0; k < face.length; k++){
                    var vert = verts[face[k]];
                    coord = translate(vert,camera);
                    if(coord === false)continue;
                    coord = [coord[0]*500+width/2,coord[1]*500+height/2];
                    ctx.lineTo(coord[0],height-coord[1]+1);
                }
                ctx.closePath();
                ctx.stroke();
            }
        }
    };
};
