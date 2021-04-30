


var InterpolateCanvas = function(){
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



    this.drawBezier = function(line){
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







    this.cubicInterpolate = function(arr,gra){
        ctx.beginPath();
        ctx.moveTo(arr[0][0],height-arr[0][1]);
        var len = arr.length;
        for(var i = 0; i < len-1; i++){
            var x0 = arr[i][0];
            var x1 = arr[i+1][0];

            var s0 = gra[i]*(x1-x0);
            var s1 = gra[i+1]*(x1-x0);
            console.log(s0,s1);
            var f0 = arr[i][1];
            var f1 = arr[i+1][1];

            var a = 2*f0-2*f1+s0+s1;
            var b = -3*f0+3*f1-2*s0-s1;
            var c = s0;
            var d = f0;


            for(var j = 0; j < 100; j++){
                var x = j/100;
                var y = (a*x*x*x+b*x*x+c*x+d);
                x = x0+(x1-x0)*x;
                ctx.lineTo(x,height-y);
            }

            /*
            var q = gra[i];
            var r = gra[i+1];
            var e = arr[i][0];
            var f = arr[i][1];
            var g = arr[i+1][0];
            var h = arr[i+1][1];

            var s = (g*g-2*e*g+e*e);
            var a = (r+q)/s;
            var b = -((r+2*q)*g+(2*r+q)*e)/s;
            var c = (q*g*g+(2*r+2*q)*e*g+r*e*e)/s;
            var d = (f*s-q*e*g*g-r*e*e*g)/s;

            var x0 = e;
            var x1 = g;
            for(var j = 0; j < 100; j++){
                var x = x0+(x1-x0)/100*j;
                var y = a*x*x*x+b*x*x+c*x+d;
                ctx.lineTo(x,height-y);
            }
            */
        }
        ctx.stroke();
    };
}


var display = new InterpolateCanvas();
document.body.appendChild(display.canvas);



var gradientToBezier = function(arr,gra){
    var bez = [];
    var len = arr.length;
    var mul = 0.36;
    bez.push(arr[0][0]);
    bez.push(arr[0][1]);
    bez.push((arr[1][0]-arr[0][0])*mul);
    bez.push((arr[1][0]-arr[0][0])*gra[0]*mul);
    for(var i = 1; i < len-1; i++){
        bez.push((arr[i-1][0]-arr[i][0])*mul);
        bez.push((arr[i-1][0]-arr[i][0])*gra[i]*mul);
        bez.push(arr[i][0]);
        bez.push(arr[i][1]);
        bez.push((arr[i+1][0]-arr[i][0])*mul);
        bez.push((arr[i+1][0]-arr[i][0])*gra[i]*mul);
    }
    bez.push((arr[len-2][0]-arr[len-1][0])*mul);
    bez.push((arr[len-2][0]-arr[len-1][0])*gra[len-1]*mul);
    bez.push(arr[len-1][0]);
    bez.push(arr[len-1][1]);
    return bez;
}


var drawBezierInterpolate = function(arr){
    var gra = findGradients(arr);
    var bezier = gradientToBezier(arr,gra);
    display.drawBezier(bezier);
    //display.drawControlLines(bezier);
    //display.drawControlPoints(bezier);
    display.drawMainPoints(bezier);
};

var drawCubicInterpolate = function(arr){
    var gra = findGradients(arr);
    var bezier = gradientToBezier(arr,gra);
    display.drawMainPoints(bezier);
    display.cubicInterpolate(arr,gra);
};

var drawCubicInterpolateM = function(arr){
    var gra = monotonicGradient(arr);
    var bezier = gradientToBezier(arr,gra);
    display.drawMainPoints(bezier);
    display.cubicInterpolate(arr,gra);
};




//drawBezierInterpolate([[0,30],[100,70],[200,370],[300,170],[400,270]]);
//drawCubicInterpolate([[0,30],[100,70],[200,370],[300,170],[400,270]]);
//drawCubicInterpolateM([[0,30],[100,70],[200,370],[300,170],[400,270]]);

var drawExpo = function(){
    var arr = [];
    var steps = 10;
    for(var i = 0; i < steps; i++){
        arr.push([i*50,(((i/steps)*2)**2)*100+20]);
    }
    drawBezierInterpolate(arr);
    drawCubicInterpolate(arr);
    drawCubicInterpolateM(arr);

}

var drawSin = function(){
    var arr = [];
    var steps = 10;
    for(var i = 0; i < steps; i++){
        arr.push([i*50,Math.sin((i/steps)*20)*100+250]);
    }
    //drawBezierInterpolate(arr);
    //drawCubicInterpolate(arr);
    drawCubicInterpolateM(arr);

}

//drawExpo();
drawSin();

/*
drawBezierInterpolate([[0,250],[50,300],[100,250],[150,200],[200,250],[250,300],[300,250],[350,200],[400,250]]);
drawCubicInterpolate([[0,250],[50,300],[100,250],[150,200],[200,250],[250,300],[300,250],[350,200],[400,250]]);
drawBezierInterpolate([[-50,200],[50,300],[150,200],[250,300],[350,200],[450,300]]);
drawCubicInterpolate([[-50,200],[50,300],[150,200],[250,300],[350,200],[450,300]]);
*/
