


var Sphere = function(){

    var canvas = document.createElement("canvas");
    canvas.width = 500;
    canvas.height = 500;
    var ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.ctx = ctx;

    var width = 500;
    var height = 500;

    var rotate2d = function(xy,angle){
        var sin = Math.sin(angle);
        var cos = Math.cos(angle);
        var x1 = xy[0]*cos-xy[1]*sin;
        var y1 = xy[0]*sin+xy[1]*cos;
        return [x1,y1];
    };

    var itr = 0;
    var translate = function(coord,camera){//translate screen coord to coord in sphere
        //if empty return false
        //camera: r xy yz scrot
        var a = coord[0];
        var b = coord[1];
        var c = camera[0];

        //screen width setting
        //a max will be 1
        a = -(a/width-0.5);
        b = -(b/width-(height/width/2));
        if(itr === 200){
            console.log(a,b,c);
        }
        itr++;
        var y0 = (c-((a*a+b*b)*(1-c*c)+1)**0.5)/(a*a+b*b+1)
        var x = a*y0;
        var z = b*y0;
        var y = y0-c;

        var yz = rotate2d([y,z],camera[2]);
        y = yz[0];
        z = yz[1];

        var xy = rotate2d([x,y],camera[1]);
        x = xy[0];
        y = xy[1];

        if(z > 1)z = 1;

        var theta = Math.atan2(x,y);
        //var phy = Math.asin(z);

        var x1 = theta/(Math.PI*2);
        //var y1 = 1-(phy+Math.PI/2)/Math.PI;
        //another projection
        var y1 = 0.5-z/2;
        //this is for squashed mercator

        return [x1,y1];
    };


    var canvasData = ctx.getImageData(0,0,width,height);
    var pictureData;

    this.loadImg = function(imageData){
        pictureData = imageData;
    };

    this.render = function(camera){
        width = canvas.width;
        height = canvas.height;
        ctx.clearRect(0,0,canvas.width,canvas.height);



        var data = canvasData.data;
        for(var y = 0; y < height; y++){
            for(var x = 0; x < width; x++){
                var idx = y*width+x;
                var ab = translate([x,y],camera);
                if(ab === false){
                    data[idx*4+0] = 0;
                    data[idx*4+1] = 0;
                    data[idx*4+2] = 0;
                    data[idx*4+3] = 0;
                }else{
                    var a = ab[0];
                    var b = ab[1];
                    a = Math.floor(a*pictureData.width);
                    b = Math.floor(b*pictureData.height);
                    var pictidx = (b*pictureData.width+a)*4;


                    data[idx*4+0] = pictureData.data[pictidx+0];
                    data[idx*4+1] = pictureData.data[pictidx+1];
                    data[idx*4+2] = pictureData.data[pictidx+2];
                    data[idx*4+3] = pictureData.data[pictidx+3];
                }
            }
        }
        //console.log(canvasData);
        ctx.putImageData(canvasData,0,0);

    }
};






urlToData("eez_world.jpg"
,function(imageData){
    console.log(imageData);
    var sphere = new Sphere();
    var canvas = sphere.canvas;
    document.body.appendChild(canvas);
    sphere.loadImg(imageData);
    sphere.render([3,0,0,0]);




    var n = 0;
    setInterval(function(){
        n+=0.05*2/5;
        m = Math.sin(n*3)/1;
        sphere.render([3,n+Math.PI/2,-m,0]);
    },20);
});
