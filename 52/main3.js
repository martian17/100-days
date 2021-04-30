


var BezierCanvas = function(){
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


    var tsteps = 20;



    this.drawLine = function(line){
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


            ctx.lineTo(x0,height-y0);
            for(var k = 1; k < tsteps; k++){
                var t = k/tsteps;
                var t2 = t*t;
                var t3 = t2*t;
                ctx.lineTo(
                    x0+3*t*ax+t2*(-6*ax+3*bx)+t3*(3*ax-3*bx+cx),
                    height-(y0+3*t*ay+t2*(-6*ay+3*by)+t3*(3*ay-3*by+cy))
                );
            }
        }
        ctx.lineTo(line[len-2],height-line[len-1]);
        ctx.stroke();
    };

    this.drawControlLines = function(line){
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
            ctx.moveTo(x0,height-y0);
            ctx.lineTo(x0+ax,height-y0+ay);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x1,height-y1);
            ctx.lineTo(x1+bx,height-y1+by);
            ctx.stroke();
        }
    };


    var drawCircle = function(x,y){
        ctx.beginPath();
        ctx.arc(x,height-y,5,0,6.28);
        ctx.closePath();
        ctx.stroke();
    };


    this.drawControlPoints = function(line){
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

    this.drawMainPoints = function(line){
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
            //drawCircle(x0+ax,y0+ay);
            drawCircle(x1,y1);
            //drawCircle(x1+bx,y1+by);
        }
    };
}


var display = new BezierCanvas();
document.body.appendChild(display.canvas);
//display.drawLine(drawLine);



var interpolate = function(arr){//data points
    //[x,y]
    var front = 0;
    var back = 0;
    var bezier = [];
    var len = arr.length;
    var clen = 0.3642124232;



    var x = arr[0][0];
    var y = arr[0][1];
    var a1 = arr[1][0]-x;
    var b1 = arr[1][1]-y;
    var c1 = arr[2][0]-x;
    var d1 = arr[2][1]-y;
    var slope = 2*b1/a1-d1/c1;
    console.log(a1,b1,c1,d1);
    bezier.push(x);
    bezier.push(y);
    bezier.push(a1*clen);
    bezier.push(a1*slope*clen);

    var x = arr[1][0];
    var y = arr[1][1];
    var a0 = arr[0][0]-x;
    var b0 = arr[0][1]-y;
    var a1 = arr[2][0]-x;
    var b1 = arr[2][1]-y;
    var c1 = arr[3][0]-x;
    var d1 = arr[3][1]-y;
    var slope = (2*b1/a1-d1/c1+b0/a0)/2;
    bezier.push(a0*clen);
    bezier.push(a0*slope*clen);
    bezier.push(x);
    bezier.push(y);
    bezier.push(a1*clen);
    bezier.push(a1*slope*clen);


    for(var i = 2; i < len-2; i++){
        //control points half the width
        var x = arr[i][0];
        var y = arr[i][1];
        var a0 = arr[i-1][0]-x;
        var b0 = arr[i-1][1]-y;
        var c0 = arr[i-2][0]-x;
        var d0 = arr[i-2][1]-y;

        var a1 = arr[i+1][0]-x;
        var b1 = arr[i+1][1]-y;
        var c1 = arr[i+2][0]-x;
        var d1 = arr[i+2][1]-y;

        var slope = (2*b1/a1-d1/c1+2*b0/a0-d0/c0)/2;

        bezier.push(a0*clen);
        bezier.push(a0*slope*clen);
        bezier.push(x);
        bezier.push(y);
        bezier.push(a1*clen);
        bezier.push(a1*slope*clen);
    }

    var x = arr[len-2][0];
    var y = arr[len-2][1];
    var a0 = arr[len-3][0]-x;
    var b0 = arr[len-3][1]-y;
    var c0 = arr[len-3][0]-x;
    var d0 = arr[len-3][1]-y;
    var a1 = arr[len-1][0]-x;
    var b1 = arr[len-1][1]-y;
    var slope = (2*b0/a0-d0/c0+b1/a1)/2;
    bezier.push(a0*clen);
    bezier.push(a0*slope*clen);
    bezier.push(x);
    bezier.push(y);
    bezier.push(a1*clen);
    bezier.push(a1*slope*clen);

    var x = arr[len-1][0];
    var y = arr[len-1][1];
    var a0 = arr[len-2][0]-x;
    var b0 = arr[len-2][1]-y;
    var c0 = arr[len-3][0]-x;
    var d0 = arr[len-3][1]-y;
    var slope = 2*b0/a0-d0/c0
    bezier.push(a0*clen);
    bezier.push(a0*slope*clen);
    bezier.push(x);
    bezier.push(y);

    console.log(bezier);
    display.drawLine(bezier);
    //display.drawControlLines(bezier);
    //display.drawControlPoints(bezier);
    display.drawMainPoints(bezier);
    return bezier;
}

interpolate([[0,30],[100,70],[200,370],[300,170],[400,270]]);

//interpolate([[0,250],[50,300],[100,250],[150,200],[200,250],[250,300],[300,250],[350,200],[400,250]]);
//interpolate([[-50,200],[50,300],[150,200],[250,300],[350,200],[450,300]]);
