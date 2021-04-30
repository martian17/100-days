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
    console.log(points);
    console.log("begin");
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
            if(points.length === 0)continue;
            var min = 100000;
            var dx = points[0][0]-x;
            var dy = points[0][1]-y;
            var p = Math.sqrt(dx*dx-dy*dy);
            if(isNaN(p)){
                min = 255;
            }else{
                min = p;
            }
            for(var i = 1; i < lenm1; i++){
                var dx = points[i][0]-x;
                var dy = points[i][1]-y;
                var p = Math.sqrt(dx*dx-dy*dy);
                if(isNaN(p)){
                    min = 255;
                }else if(p < min){
                    min = p;
                }
            }
            if(points.length === 1)continue;
            var dx = points[lenm1][0]-x;
            var dy = points[lenm1][1]-y;
            var p = Math.sqrt(dx*dx-dy*dy);
            if(isNaN(p)){
                min = 10;
            }else if(p < min){
                min = p;
            }
            arr[(y*w+x)*4+3] = 255-min;
        }
    }
    console.log("end");
};







var canvas = document.createElement("canvas");
document.body.appendChild(canvas);

var width = 1000;
var height = 500;

canvas.width = width;
canvas.height = height;

var ctx = canvas.getContext("2d");
var IDT = ctx.getImageData(0,0,width,height);
var data = IDT.data;

var objs = [];

var add = function(x,y,vx,vy,mass){
    objs.unshift([x,y,vx,vy,mass]);
}


var start = 0;

var animate = function(t){
    if(start === 0){
        start = t;
    }
    var dt = t - start;
    start = t;

    var steps = 10;
    for(var i = 0; i < steps; i++){
        step(dt/steps);
    }

    render();

    requestAnimationFrame(animate);
}


var G = 1;

var step = function(dt){
    //console.log(dt);
    for(var i = 0; i < objs.length; i++){
        for(var j = i+1; j < objs.length; j++){
            //bidirectional
            var o1 = objs[i];
            var o2 = objs[j];
            var dx = o2[0]-o1[0];
            var dy = o2[1]-o1[1];
            var dist2 = dx*dx+dy*dy;
            var dist = Math.sqrt(dist2);
            if(dist < 20){
                var Bx = o2[0]-o1[0];
                var By = o2[1]-o1[1];
                var alphal = ((o1[2]-o2[2])*Bx+(o1[3]-o2[3])*By)/(Bx*Bx+By*By)/2;
                var alphax = alphal*Bx;
                var alphay = alphal*By;

                o1[2] = o1[2]-2*alphax;
                o1[3] = o1[3]-2*alphay;
                o2[2] = o2[2]+2*alphax;
                o2[3] = o2[3]+2*alphay;
                continue;
            }

            var acc1 = G*o2[4]/dist2;
            var acc1x = acc1*(dx/dist);
            var acc1y = acc1*(dy/dist);
            o1[2]+= acc1x*dt;
            o1[3]+= acc1y*dt;

            var acc2 = G*o1[4]/dist2;
            var acc2x = acc2*(-dx/dist);
            var acc2y = acc2*(-dy/dist);
            o2[2]+= acc2x*dt;
            o2[3]+= acc2y*dt;
        }
    }
    for(var i = 0; i < objs.length; i++){
        var o = objs[i];
        o[0] += o[2]*dt;
        o[1] += o[3]*dt;
    }
};


var render = function(){
    ctx.clearRect(0,0,width,height);
    worley(data,width,height,objs);
    ctx.putImageData(IDT,0,0);
    /*for(var i = 0; i < objs.length; i++){
        var o = objs[i];
        ctx.beginPath();
        ctx.arc(o[0],o[1],10,0,6.28);
        ctx.closePath();
        ctx.fill();
    }*/
};

var click = function(e){
    var lx = e.clientX + scrollX - this.offsetLeft;
    var ly = e.clientY + scrollY - this.offsetTop;

    add(lx,ly,0,0,1);
}


canvas.addEventListener("click",click);

canvas.addEventListener("click",function(e){
    console.log(e.clientX+8,e.clientY+8);
});


requestAnimationFrame(animate);
