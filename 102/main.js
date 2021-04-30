var dist = function(a,b){
    var dx = b[0]-a[0];
    var dy = b[1]-a[1];
    //return Math.sqrt(Math.sqrt(dx*dx-dy*dy))*10;
    return Math.sqrt(dx*dx-dy*dy);
};

var color = function(val){
    val = Math.floor(val);
    if(val > 255){
        val = 255;
    }else if(val < 0){
        val = 0;
    }
    return [
        //Math.floor(val/2),
        //Math.floor(val/2),
        val,
        val,
        val,
        255
    ];
}

var first = true;
var worley = function(arr,w,h,points){
    //var n = 10;
    //var points = [];
    /*[[924.5351892651144, 433.6716297422179],
[708.4410823738365, 24.36622399534172],
[928.7243284732367, 439.1472939012164],
[33.03647291994638, 324.12453305839773],
[866.4356992965068, 329.0791996407234],
[478.102691397692, 9.274890331784746],
[322.6797786779123, 402.8194304801067],
[116.7568570362223, 400.5810690041538],
[752.7989224985796, 295.2059271143731],
[970.0349195742009, 238.3740594351158]];*/
    //for(var i = 0; i < n; i++){
    //    points.push([Math.random()*w,Math.random()*h]);
    //}
    //console.log(points);
    //console.log("begin");
    /*for(var y = 0; y < h; y++){
        for(var x = 0; x < w; x++){
            //var idx = y*w+x;
            var min = 100000;
            for(var i = 0; i < points.length; i++){
                var p = dist(points[i],[x,y]);
                if(p < min){
                    min = p;
                }
            }
            //var col = color(min);
            //arr[idx*4+0] = col[0];
            //arr[idx*4+1] = col[1];
            //arr[idx*4+2] = col[2];
            //arr[idx*4+3] = col[3];
            arr[(y*w+x)*4+3] = 255-min;
        }
    }*/
    var len = points.length;
    var lenm1 = len - 1;
    for(var y = 0; y < h; y++){
        for(var x = 0; x < w; x++){
            var min = 100000;
            /*var dx = points[0][0]-x;
            var dy = points[0][1]-y;
            var p = Math.sqrt(dx*dx-dy*dy);
            if(isNaN(p)){
                min = 255;
            }else{
                min = p;
            }*/
            for(var i = 0; i < lenm1+1; i++){
                var dx = points[i][0]-x;
                var dy = points[i][1]-y;
                var p = Math.sqrt(dx*dx-dy*dy);
                if(isNaN(p)){
                    min = 255;
                }else if(p < min){
                    min = p;
                }
            }
            /*var dx = points[lenm1][0]-x;
            var dy = points[lenm1][1]-y;
            var p = Math.sqrt(dx*dx-dy*dy);
            if(isNaN(p)){
                min = 10;
            }else if(p < min){
                min = p;
            }*/
            arr[(y*w+x)*4+3] = 255-min;
        }
    }
    //console.log("end");
};


var base = [100,0,0];
var randColor = function(){
    base[0]+=10;
    return "rgb("+base[0]+","+base[1]+","+base[2]+")"
};



var width = 1000;
var height = 500;
var canvas = document.createElement("canvas");
canvas.width = width;
canvas.height = height;
document.body.appendChild(canvas);
var ctx = canvas.getContext("2d");
var IDT = ctx.getImageData(0,0,width,height);
var data = IDT.data;


var canvas2 = document.createElement("canvas");
canvas2.style = "position:absolute;top:8px;left:8px;z-index:-1;";
canvas2.width = width;
canvas2.height = height;
document.body.appendChild(canvas2);
var ctx2 = canvas2.getContext("2d");

var render2 = function(){
    ctx2.clearRect(0,0,width,height);
    for(var i = 0; i < points.length; i++){
        var point = points[i];
        var x = point[0];
        var y = point[1];
        ctx2.fillStyle = point[4];
        ctx2.strokeStyle = point[4];
        ctx2.lineWidth = 1;
        //upper triangle
        ctx2.beginPath();
        ctx2.moveTo(x,y);
        ctx2.lineTo(x-(width+height),y-(width+height));
        ctx2.lineTo(x+(width+height),y-(width+height));
        ctx2.closePath();
        ctx2.fill();
        ctx2.stroke();
        ctx2.beginPath();
        ctx2.moveTo(x,y);
        ctx2.lineTo(x-(width+height),y+(width+height));
        ctx2.lineTo(x+(width+height),y+(width+height));
        ctx2.closePath();
        ctx2.fill();
        ctx2.stroke();
    }
}


var n = 10;
var points = [];
for(var i = 0; i < n; i++){
    points.push([Math.random()*width,Math.random()*height,Math.random()-0.5,Math.random()-0.5,randColor()]);
}

var start = 0;
var animate = function(t){
    if(start === 0)start = t;
    var dt = t - start;
    start = t;

    for(var i = 0; i < n-1+1; i++){
        var a = points[i];

        var x = a[0]+a[2]*dt/5;
        var y = a[1]+a[3]*dt/5;
        var vx = a[2];
        var vy = a[3];
        if(x < 0){
            vx = Math.abs(vx);
        }else if(x > width){
            vx = -Math.abs(vx);
        }
        if(y < 0){
            vy = Math.abs(vy);
        }else if(y > height){
            vy = -Math.abs(vy);
        }
        points[i] = [x,y,vx,vy,points[i][4]];
        //[(a[0]+a[2]*dt/50+width)%width,(a[1]+a[3]*dt/50+height)%height,a[2],a[3]];
    }
    worley(data,width,height,points);
    ctx.putImageData(IDT,0,0);
    render2();
    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

canvas.addEventListener("click",function(e){
    console.log(e.clientX+8,e.clientY+8);
});
