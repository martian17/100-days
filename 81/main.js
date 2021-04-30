var dist = function(a,b){
    var dx = b[0]-a[0];
    var dy = b[1]-a[1];
    //return Math.sqrt(Math.sqrt(dx*dx-dy*dy))*10;
    return Math.sqrt(dx*dx+dy*dy);
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

var add = function(x,y,vx,vy,mass,col){
    objs.unshift([x,y,vx,vy,mass,col]);
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

    var first = true;
    ctx.clearRect(0,0,width,height);
    for(var y = 0; y < height; y++){
        for(var x = 0; x < width; x++){
            var min = 10000;
            var obj = [0,0,0,0,0,[0,0,0,255]];
            for(var i = 0; i < objs.length; i++){
                var d = dist(objs[i],[x,y]);
                if(d < min){
                    min = d;
                    obj = objs[i];
                }
            }
            var idx = (y*width+x)*4;
            if(first)console.log(obj);
            first = false;
            data[idx+0] = obj[5][0];
            data[idx+1] = obj[5][1];
            data[idx+2] = obj[5][2];
            data[idx+3] = obj[5][3];
        }
    }
    ctx.putImageData(IDT,0,0);
    for(var i = 0; i < objs.length; i++){
        var o = objs[i];
        ctx.beginPath();
        ctx.arc(o[0],o[1],10,0,6.28);
        ctx.closePath();
        ctx.fill();
    }
};

var click = function(e){
    var lx = e.clientX + scrollX - this.offsetLeft;
    var ly = e.clientY + scrollY - this.offsetTop;

    add(lx,ly,0,0,1,[Math.floor(Math.random()*256),Math.floor(Math.random()*256),Math.floor(Math.random()*256),255]);
}


canvas.addEventListener("click",click);

canvas.addEventListener("click",function(e){
    console.log(e.clientX+8,e.clientY+8);
});


requestAnimationFrame(animate);
