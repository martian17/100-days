var canvas = document.createElement("canvas");
document.body.appendChild(canvas);

var width = 1000;
var height = 500;

canvas.width = width;
canvas.height = height;

var ctx = canvas.getContext("2d");
ctx.fillStyle = "#ffffff05";

var imagedata = ctx.getImageData(0,0,width,height);
var data = imagedata.data;

var st = 3.333333;
var ed = 4;

var plotCoord = function(a,b){
    a = (a-st)*ed/(ed-st);
    a = Math.floor(a*(width-100)/4+50);
    b = Math.floor((height-50)-b*(height-100));
    var c = (a+b*width)*4;
    data[c+3] = 200;
};

var clearData = function(){
    for(var i = 0; i < data.length; i++){
        data[i] = 0;
    }
}

var render = function(){
    clearData();
    var da = (ed-st)/(width-100);

    for(var a = st; a < ed; a+= da){
        x = 0.3;
        for(var i = 0; i < 2000; i++){
            x = a*x*(1-x);
        }
        for(var i = 0; i < 600; i++){
            x = a*x*(1-x);
            plotCoord(a,x);
        }
    }
    ctx.putImageData(imagedata,0,0);
};

render();


var txt = body.add("input",false,"type:text;value:"+st+","+ed+";");
txt.e.addEventListener("keyup",
function(e){
    if(e.keyCode === 13){
        var vals = txt.e.value.split(",").map(function(a){
            if(isNaN(a)){
                return 0;
            }
            a = parseFloat(a);
            if(a < 0 || a > 4){
                return 0;
            }
            return a;
        }).sort();
        console.log(vals);
        st = vals[0] || 0;
        ed = vals[1] || 4;
        txt.e.value = st+","+ed;
        render();
    }
});
