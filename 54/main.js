



var Chart = function(){
    var canvas = document.createElement("canvas");
    var width = 500;
    var height = 500;
    canvas.width = width;
    canvas.height = height;
    this.canvas = canvas;
    var ctx = canvas.getContext("2d");
    this.setWidth = function(w){
        width = w;
        canvas.width = w;
    };
    this.setHeight = function(h){
        height = h;
        canvas.height = h;
    };
    this.clear = function(){
        canvas.clearRect(0,0,width,height);
    }
    this.drawChart = function(arr,low,high,col){
        var len = arr.length;
        ctx.beginPath();
        moveTo(low,0);
        for(var i = 0; i < len; i++){
            lineTo((high-low)/len*i,arr[i]);
        }
        lineTo(high,0);
        ctx.closePath();
        ctx.fillStyle = col;
        ctx.fill();
    }
    var xmin = 0;
    var ymin = 0;
    var xmax = 0;
    var ymax = 0;
    this.setRange = function(xmin0,ymin0,xmax0,ymax0){
        xmin = xmin0;
        ymin = ymin0;
        xmax = xmax0;
        ymax = ymax0;
    }
    var moveTo = function(x,y){
        ctx.moveTo(
            (x-xmin)/(xmax-xmin)*width,
            height-(y-ymin)/(ymax-ymin)*height
        );
    }
    var lineTo = function(x,y){
        ctx.lineTo(
            (x-xmin)/(xmax-xmin)*width,
            height-(y-ymin)/(ymax-ymin)*height
        );
    }
}




var chart = new Chart();
chart.setWidth(1000);
chart.setHeight(500);
document.body.appendChild(chart.canvas);



var xmin = 0.1;
var ymin = 0;
var xmax = 0.8;
var ymax = 50;
chart.setRange(xmin,ymin,xmax,ymax);

var data = [];
var itrs = 1000;

for(var i = 0; i < itrs; i++){
    var hitrate = xmin+i/itrs*(xmax-xmin);
    //var hittime = 1+(1-hitrate)*49;
    var hittime = 1*hitrate+(1-hitrate)*50;
    data.push(hittime);
}
chart.drawChart(data,xmin,xmax,"#0f0");

console.log(data);
