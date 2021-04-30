var sigmoid0 = function(x){//[0,0] = [0,0] slope 1 max 1 min 1
    return -1/(1+Math.pow(Math.E,4*x)) + 0.5;
};
var newton3 = function(a,b,c,d,x){
    var itr = 4;

    //first derivative
    //3ax^2+2bx+c
    var a1 = 3*a;
    var b1 = 2*b;
    var c1 = c;
    for(var i = 0; i < itr; i++){
        var slope = a1*x*x+b1*x+c1;
        var fx = a*x*x*x+b*x*x+c*x+d;
        x += sigmoid0(-fx/slope);
    }
    return x;
};


var solveCubic = function(a,b,c,d){
    return newton3(a,b,c,d,-d);
};


var bezierX = function(A,B,x){
    if(x === 0){
        return 0;
    }else if(x === 1){
        return 1;
    }
    var a = 3*A[0]-3*B[0]+1;
    var b = -6*A[0]+3*B[0];
    var c = 3*A[0];
    var d = -x;
    var t = solveCubic(a,b,c,d);
    if(isNaN(t)){
        console.log("t is NaN");
        console.log(A,B,x);
        console.log(a,b,c,d);
    }
    var y = t*(3*A[1])+t*t*(-6*A[1]+3*B[1])+t*t*t*(3*A[1]-3*B[1]+1);
    return y;
};


var bezierXY = function(A,B,yy,x){
    if(x === 0){
        return 0;
    }else if(x === 1){
        return 1;
    }
    var a = 3*A[0]-3*B[0]+1;
    var b = -6*A[0]+3*B[0];
    var c = 3*A[0];
    var d = -x;
    var t = solveCubic(a,b,c,d);
    if(isNaN(t)){
        console.log("t is NaN");
        console.log(A,B,x);
        console.log(a,b,c,d);
    }
    var y = t*(3*A[1])+t*t*(-6*A[1]+3*B[1])+t*t*t*(3*A[1]-3*B[1]+yy);
    return y;
};
