


var Display = function(){

    var canvas = document.createElement("canvas");
    canvas.width = 500;
    canvas.height = 500;
    var ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.ctx = ctx;

    var width = 500;
    var height = 500;
    var S = [100,400];
    var E = [400,100];

    var itr = 0;

    var SEXY = function(xy){
        var x = S[0]+xy[0]*(E[0]-S[0]);
        var y = S[1]+xy[1]*(E[1]-S[1]);
        return [x,y];
    };

    var A,B,A1,B1,R=10;
    this.setAB = function(A0,B0){
        A = A0;
        B = B0;
        A1 = SEXY(A);
        B1 = SEXY(B);
    };


    //バグいベジエ曲線www 三次方程式といてます。
    var bezierX0 = function(A,B,x){
        var a = -3*A[0]+3*B[0]-1;
        var b = 6*A[0]-3*B[0];
        var c = -3*A[0];
        var d = x;
        var p = -b/(3*a);
        var q = p*p*p+(b*c-3*a*d)/(6*a*a);
        var r = c/(3*a);
        var t = Math.cbrt(q+Math.sqrt(q*q+(r-p*p)**3))+Math.cbrt(q-Math.sqrt(q*q+(r-p*p)**3))+p;
        var y = t*(3*A[1])+t*t*(-6*A[1]+3*B[1])+t*t*t*(3*A[1]-3*B[1]+1);
        return y;
    };

    //[0.2833333333333333, 0.4733333333333334]
    //[0.6166666666666667, 0.44999999999999996]

    function cuberoot(x) {
        var y = Math.pow(Math.abs(x), 1/3);
        return x < 0 ? -y : y;
    }

    function cubicSolution(a, b, c, d) {
        if (Math.abs(a) < 1e-8) { // Quadratic case, ax^2+bx+c=0
            a = b; b = c; c = d;
            if (Math.abs(a) < 1e-8) { // Linear case, ax+b=0
                a = b; b = c;
                if (Math.abs(a) < 1e-8) // Degenerate case
                    return 0;
                return -b/a;
            }

            var D = b*b - 4*a*c;
            if (Math.abs(D) < 1e-8)
                return [-b/(2*a)];
            else if (D > 0)
                return (-b+Math.sqrt(D))/(2*a);
            return 0;
        }

        // Convert to depressed cubic t^3+pt+q = 0 (subst x = t - b/3a)
        var p = (3*a*c - b*b)/(3*a*a);
        var q = (2*b*b*b - 9*a*b*c + 27*a*a*d)/(27*a*a*a);
        var roots;

        if (Math.abs(p) < 1e-8) { // p = 0 -> t^3 = -q -> t = -q^1/3
            roots = [cuberoot(-q)];
        } else if (Math.abs(q) < 1e-8) { // q = 0 -> t^3 + pt = 0 -> t(t^2+p)=0
            roots = [0].concat(p < 0 ? [Math.sqrt(-p), -Math.sqrt(-p)] : []);
        } else {
            var D = q*q/4 + p*p*p/27;
            if (Math.abs(D) < 1e-8) {       // D = 0 -> two roots
                roots = [-1.5*q/p, 3*q/p];
            } else if (D > 0) {             // Only one real root
                var u = cuberoot(-q/2 - Math.sqrt(D));
                roots = [u - p/(3*u)];
            } else {                        // D < 0, three roots, but needs to use complex numbers/trigonometric solution
                var u = 2*Math.sqrt(-p/3);
                var t = Math.acos(3*q/p/u)/3;  // D < 0 implies p < 0 and acos argument in [-1..1]
                var k = 2*Math.PI/3;
                roots = [u*Math.cos(t), u*Math.cos(t-k), u*Math.cos(t-2*k)];
            }
        }

        // Convert back from depressed cubic
        for (var i = 0; i < roots.length; i++)
            roots[i] -= b/(3*a);

        if(roots.length === 0)return 0;

        return roots[0];
    }


    var bezierX = function(A,B,x){
        var a = -3*A[0]+3*B[0]-1;
        var b = 6*A[0]-3*B[0];
        var c = -3*A[0];
        var d = x;
        var t = cubicSolution(a,b,c,d);
        var y = t*(3*A[1])+t*t*(-6*A[1]+3*B[1])+t*t*t*(3*A[1]-3*B[1]+1);
        return y;
    };


    this.render = function(){//A is ctrl1 B is ctrl2
        width = canvas.width;
        height = canvas.height;
        ctx.clearRect(0,0,width,height);
        ctx.beginPath();
        ctx.moveTo(S[0],S[1]);

        console.log(A,B);
        var dx = 0.1;
        for(var x = 0; x < 1; x+=dx){
            var y = bezierX(A,B,x);
            var x1 = S[0]+x*(E[0]-S[0]);
            var y1 = S[1]+y*(E[1]-S[1]);
            ctx.lineTo(x1,y1);
        }

        /*var dt = 0.05;
        for(var t = 0; t < 1; t+=dt){
            var x = t*(3*A[0])+t*t*(-6*A[0]+3*B[0])+t*t*t*(3*A[0]-3*B[0]+1);
            var y = t*(3*A[1])+t*t*(-6*A[1]+3*B[1])+t*t*t*(3*A[1]-3*B[1]+1);
            x = S[0]+x*(E[0]-S[0]);
            y = S[1]+y*(E[1]-S[1]);
            ctx.lineTo(x,y);
        }*/
        ctx.lineTo(E[0],E[1]);
        ctx.stroke();

        //rendering lines and control points

        //rendering lines
        ctx.beginPath();
        ctx.moveTo(S[0],S[1]);
        ctx.lineTo(A1[0],A1[1]);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(B1[0],B1[1]);
        ctx.lineTo(E[0],E[1]);
        ctx.stroke();

        //rendering control points
        ctx.fillStyle  = "#f0f";
        ctx.beginPath();
        ctx.arc(A1[0],A1[1],R,0,6.28);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle  = "#0ff";
        ctx.beginPath();
        ctx.arc(B1[0],B1[1],R,0,6.28);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    };




    var dist2 = function(a,b){
        var dx = b[0] - a[0];
        var dy = b[1] - a[1];
        return dx*dx+dy*dy;
    };

    var moving = false;
    var clkOffset = [0,0];
    canvas.addEventListener("mousedown",function(e){
        var localx = e.clientX+scrollX-canvas.offsetLeft;
        var localy = e.clientY+scrollY-canvas.offsetTop;
        var x = (localx-S[0])/(E[0]-S[0]);
        var y = (localy-E[1])/(E[1]-S[1]);
        //if
        if(dist2(B1,[localx,localy]) < R*R){//move B
            moving = "B";
            clkOffset = [localx-B1[0],localy-B1[1]];
        }else if(dist2(A1,[localx,localy]) < R*R){//move A
            moving = "A";
            clkOffset = [localx-A1[0],localy-A1[1]];
        }
    });
    document.body.addEventListener("mouseup",function(){
        moving = false;
    });
    canvas.addEventListener("mousemove",function(e){
        if(!moving)return false;
        var localx = e.clientX+scrollX-canvas.offsetLeft-clkOffset[0];
        var localy = e.clientY+scrollY-canvas.offsetTop-clkOffset[0];
        var x = (localx-S[0])/(E[0]-S[0]);
        var y = (localy-E[1])/(E[1]-S[1])+1;
        if(x < 0) x = 0;
        if(x > 1) x = 1;
        if(moving === "A"){
            A = [x,y];
            A1 = SEXY(A);
        }else if(moving === "B"){
            B = [x,y];
            B1 = SEXY(B);
        }
        this.render();
    }.bind(this));
};






var display = new Display();
var canvas = display.canvas;
var ctx = display.ctx;
document.body.appendChild(canvas);
display.setAB([0.17,0.67],[0.83,0.67]);
display.render();




urlToData("unnamed.gif"
,function(imageData){
    var t = 0;
    var drawThings = function(){
        t+=30;
        var width = canvas.width;
        var height = canvas.height;
        ctx.clearRect(0,0,width,height);
        ctx.beginPath();
        ctx.ellipse(250,100,200*Math.abs(Math.sin(t/300)),100*Math.abs(Math.sin(t/300)),0,0,6.28);
        ctx.closePath();
        ctx.fillStyle = "rgb(100,50,0)";
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(250,100,200*Math.abs(Math.sin(t/200)),100*Math.abs(Math.sin(t/200)),0,0,6.28);
        ctx.closePath();
        ctx.fillStyle = "rgb(255,255,0)";
        ctx.fill();
        ctx.font = "30px Arial";
        ctx.fillStyle = "rgb("+Math.floor(255*Math.abs(Math.sin(t/100)))+","+Math.floor(255*Math.abs(Math.sin(t/100+2)))+","+Math.floor(255*Math.sin(t/100+4))+")";
        ctx.fillText("カルダノの公式むずい！",100,100);
        ctx.putImageData(imageData,150+Math.floor(20*Math.cos(t/150)),200+Math.floor(20*Math.sin(t/200)));
    };

    setInterval(drawThings,20);

});
