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
var worley = function(arr,w,h){
    var n = 10;
    var points = [];/*[[924.5351892651144, 433.6716297422179],
[708.4410823738365, 24.36622399534172],
[928.7243284732367, 439.1472939012164],
[33.03647291994638, 324.12453305839773],
[866.4356992965068, 329.0791996407234],
[478.102691397692, 9.274890331784746],
[322.6797786779123, 402.8194304801067],
[116.7568570362223, 400.5810690041538],
[752.7989224985796, 295.2059271143731],
[970.0349195742009, 238.3740594351158]];*/
    for(var i = 0; i < n; i++){
        points.push([Math.random()*w,Math.random()*h]);
    }
    console.log(points);
    console.log("begin");
    for(var y = 0; y < h; y++){
        for(var x = 0; x < w; x++){
            var idx = y*w+x;
            var sorted = points.map(a=>dist(a,[x,y])).sort((a,b)=>(a-b));
            if(x === 400 && y === 0){
                first = false;
                console.log(sorted);
            }
            var col = color(sorted[0]);
            arr[idx*4+0] = col[0];
            arr[idx*4+1] = col[1];
            arr[idx*4+2] = col[2];
            arr[idx*4+3] = col[3];
        }
    }
    console.log("end");
};


var canvas = document.createElement("canvas");
var width = 1000;
var height = 500;
canvas.width = width;
canvas.height = height;
document.body.appendChild(canvas);
var ctx = canvas.getContext("2d");
var IDT = ctx.getImageData(0,0,width,height);
var data = IDT.data;

worley(data,width,height);
ctx.putImageData(IDT,0,0);

canvas.addEventListener("click",function(e){
    console.log(e.clientX+8,e.clientY+8);
});
