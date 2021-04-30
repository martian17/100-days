


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


var cubicSolution = function(a,b,c,d){//returns one real solution
    if(a === 0){//quadratic
        if(b === 0){//linear
            if(c === 0){//degenerate, no solution
                console.log("degenerate");
                return 0;
            }
            return -d/c;
        }
        return (-c+Math.sqrt(c*c-4*b*d))/(2*b);
    }
    //cubic
    var p = -b/(3*a);
    var q = p*p*p+(b*c-3*a*d)/(6*a*a);
    var r = c/(3*a);
    var determinant = q*q+(r-p*p)**3;
    if(determinant >= 0){
        return Math.cbrt(q+Math.sqrt(determinant))+Math.cbrt(q-Math.sqrt(determinant))+p;
    }else{
        b /= a;
        c /= a;
        d /= a;
        q = (3.0*c - (b*b))/9.0;
        r = -(27.0*d) + b*(9.0*c - 2.0*(b*b));
        r /= 54.0;
        var discrim = q*q*q + r*r;
        var term1 = (b/3.0);
        q = -q;
        dum1 = q*q*q;
        dum1 = Math.acos(r/Math.sqrt(dum1));
        r13 = 2.0*Math.sqrt(q);
        return -term1 + r13*Math.cos(dum1/3.0);
    }
}

    var bezierX = function(A,B,x){
        var a = -3*A[0]+3*B[0]-1;
        var b = 6*A[0]-3*B[0];
        var c = -3*A[0];
        var d = x;
        var p = -b/(3*a);
        var q = p*p*p+(b*c-3*a*d)/(6*a*a);
        var r = c/(3*a);
        var determinant = q*q+(r-p*p)**3;
        if(determinant >= 0){
            var t = Math.cbrt(q+Math.sqrt(determinant))+Math.cbrt(q-Math.sqrt(determinant))+p;
            var y = t*(3*A[1])+t*t*(-6*A[1]+3*B[1])+t*t*t*(3*A[1]-3*B[1]+1);
            return y;
        }else{
            var t = Math.E*Math.cbrt(Math.sqrt(q**2+Math.sqrt(-determinant)**2))+Math.E*Math.cbrt(Math.sqrt(q**2-Math.sqrt(-determinant)**2))+p;
            var y = t*(3*A[1])+t*t*(-6*A[1]+3*B[1])+t*t*t*(3*A[1]-3*B[1]+1);
            return y;
        }
    };


    this.render = function(){//A is ctrl1 B is ctrl2
        width = canvas.width;
        height = canvas.height;
        ctx.clearRect(0,0,width,height);
        ctx.beginPath();
        ctx.moveTo(S[0],S[1]);

        console.log(A,B);
        var dx = 0.001;
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
document.body.appendChild(canvas);
display.setAB([0.17,0.67],[0.83,0.67]);
display.render();
