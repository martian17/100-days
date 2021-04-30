var sigmoid = function(v){
    return -1/(1+Math.E**(4*v))+1/2;
};


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


        return [rotate2d([x2,y2],camera[5]),y];//y is the dist
    };//screen is at distance 1

    var first = true;
    var calcInten = function(tri3d){
        return tri3d[0][1];
    };

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
        //ranks polygon from farthest to closest
        //if normal vector is minus don't render
        var polys = [];

        for(var i = 0; i < this.shapes.length; i++){
            var poly = this.shapes[i];
            var verts = poly[0];
            var faces = poly[1];
            for(var j = 0; j < faces.length; j++){
                var face = faces[j];
                var tri2d = [];
                var tri3d = [];
                var distsum = 0;
                if(face.length !== 3){
                    console.log("error: face not triangle");
                    return false;
                }
                for(var k = 0; k < 3; k++){//only allows triangles
                    var vert = verts[face[k]];
                    tri3d[k] = vert;
                    vert = translate(vert,camera);
                    if(vert === false)continue;
                    var coord = vert[0];
                    var dist = vert[1];
                    tri2d[k] = coord;
                    distsum += dist;
                }
                var intensity = calcInten(tri3d);
                var dist = distsum/3;
                var rendervert = [tri2d,tri3d,dist,intensity];//2d,3d,dist,intensity
                polys.push(rendervert);
            }
        }


        polys.sort((a,b)=>{
            return b[2] - a[2];
        });//small to large

        for(var i = 0; i < polys.length; i++){
            var rendervert = polys[i];
            ctx.beginPath();
            var tri = rendervert[0];
            ctx.moveTo(tri[0][0]*500+width/2,height-(tri[0][1]*500+height/2));
            ctx.lineTo(tri[1][0]*500+width/2,height-(tri[1][1]*500+height/2));
            ctx.lineTo(tri[2][0]*500+width/2,height-(tri[2][1]*500+height/2));
            ctx.closePath();

            var col = Math.floor((1-Math.abs(sigmoid(rendervert[3])))*255);
            if(first){
                console.log(rendervert);
                first = false;
            }


            ctx.fillStyle = "rgb("+col+","+col+","+col+")";
            ctx.fill();
        }


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
