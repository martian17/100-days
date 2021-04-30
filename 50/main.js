
var Display = function(){
    var canvas = document.createElement("canvas");
    var width = 500;
    var height = 500;
    canvas.width = width;
    canvas.height = height;
    this.canvas = canvas;
    var ctx = canvas.getContext("2d");

    var view = {};
    view.x = 0;
    view.y = 0;//top left
    view.zoom = 1;

    this.mode = "";
    //move, draw


    var lines = [
        [200,200,30,0,-30,0,300,300,30,0,-30,0,400,400]
    ];
    //x,y,c1,c1,c2,c2,x,y

    var tsteps = 20;



    var drawLine = function(line){
        var len = line.length;
        ctx.beginPath();
        for(var j = 0; j < len-2; j += 6){
            var x0 = line[j];
            var y0 = line[j+1];
            var ax = line[j+2];
            var ay = line[j+3];
            var cx = line[j+6]-x0;
            var cy = line[j+7]-y0;
            var bx = cx+line[j+4];
            var by = cy+line[j+5];


            ctx.lineTo(x0,y0);
            for(var k = 1; k < tsteps; k++){
                var t = k/tsteps;
                var t2 = t*t;
                var t3 = t2*t;
                ctx.lineTo(
                    x0+3*t*ax+t2*(-6*ax+3*bx)+t3*(3*ax-3*bx+cx),
                    y0+3*t*ay+t2*(-6*ay+3*by)+t3*(3*ay-3*by+cy)
                );
            }
        }
        ctx.lineTo(line[len-2],line[len-1]);
        ctx.stroke();
    };

    var drawControlLines = function(line){
        var len = line.length;
        for(var j = 0; j < len-2; j += 6){
            var x0 = line[j];
            var y0 = line[j+1];
            var ax = line[j+2];
            var ay = line[j+3];

            var bx = line[j+4];
            var by = line[j+5];
            var x1 = line[j+6];
            var y1 = line[j+7];

            ctx.beginPath();
            ctx.moveTo(x0,y0);
            ctx.lineTo(x0+ax,y0+ay);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x1,y1);
            ctx.lineTo(x1+bx,y1+by);
            ctx.stroke();
        }
    };


    var drawCircle = function(x,y){
        ctx.beginPath();
        ctx.arc(x,y,5,0,6.28);
        ctx.closePath();
        ctx.stroke();
    };


    var drawControlPoints = function(line){
        var len = line.length;
        for(var j = 0; j < len-2; j += 6){
            var x0 = line[j];
            var y0 = line[j+1];
            var ax = line[j+2];
            var ay = line[j+3];

            var bx = line[j+4];
            var by = line[j+5];
            var x1 = line[j+6];
            var y1 = line[j+7];

            drawCircle(x0,y0);
            drawCircle(x0+ax,y0+ay);
            drawCircle(x1,y1);
            drawCircle(x1+bx,y1+by);
        }
    };


    this.render = function(){
        for(var i = 0; i < lines.length; i++){
            var line = lines[i];
            var len = line.length;
            //draw the lines themselves
            drawLine(line);

            //draw the ccontrol lines
            drawControlLines(line);

            //draw the ccontrol points
            drawControlPoints(line);

        }
    }
}


var display = new Display();
document.body.appendChild(display.canvas);
display.render();
