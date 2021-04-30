var newton3 = function(a,b,c,d,x){
    var itr = 200;

    //first derivative
    //3ax^2+2bx+c
    var a1 = 3*a;
    var b1 = 2*b;
    var c1 = c;
    for(var i = 0; i < itr; i++){
        var slope = a1*x*x+b1*x+c1;
        var fx = a*x*x*x+b*x*x+c*x+d;
        x += -fx/slope;
    }
    return x;
};


var solveCubic = function(a,b,c,d){
    if(a === 0){//quadratic
        if(b === 0){//linear
            if(c === 0){//degenerate straight horizontal line
                consolelog("degenerate");
                return 0;
            }
            consolelog("a");
            return -d/c;
        }
        var det = c*c-4*b*d;
        if(det < 0){//no real solution, return the min/max
            consolelog("b");
            return -c/(2*b);
        }
        //real solution
        det = Math.sqrt(det);
        consolelog("c");
        var sol = (-c-det)/(2*b);
        if(0 <= sol && sol <= 1){
            return sol;
        }
        return (-c+det)/(2*b);
    }
    //first derivative
    //3ax^2+2bx+c
    var a1 = 3*a;
    var b1 = 2*b;
    var c1 = c;
    //second derivative
    var a2 = 2*a1;
    var b2 = b1;


    var det1 = b1*b1-4*a1*c1;
    if(det1 <= 0){//single solution
        var r = -b2/a2;
        var fr = a*r*r*r+b*r*r+c*r+d;
        if(Math.abs(fr) < 1e-8)return r;
        var start;
        if(fr*a < 0){
            start = r-fr;
        }else{
            start = r+fr;
        }
        consolelog("d");
        consolelog(r,fr);
        consolelog(a,b,c,d,start);
        return newton3(a,b,c,d,start);
    }
    //two winding peaks
    det1 = Math.sqrt(det1);
    var p = (-b1-det1)/(2*a1);
    var q = (-b1+det1)/(2*a1);//local min max
    var fp = a*p*p*p+b*p*p+c*p+d;
    var fq = a*q*q*q+b*q*q+c*q+d;
    if(fp*fq < 0){//pq different sign, three solutions
        consolelog("three");
        var start1 = p-(q-p)/2;
        var start2 = (p+q)/2;
        var start3 = q+(q-p)/2;
        //consolelog(newton3(a,b,c,d,start1),newton3(a,b,c,d,start2),newton3(a,b,c,d,start3));
        consolelog(a,b,c,d,start1,start2,start3);
        var sol = newton3(a,b,c,d,start1);
        if(0 <= sol && sol <= 1){
            return sol;
        }
        sol = newton3(a,b,c,d,start2);
        if(0 <= sol && sol <= 1){
            return sol;
        }
        return newton3(a,b,c,d,start3);
    }else if(a*fp > 0){//[a+fp+ or a-fp-]solution on the left side
        var start = p-(q-p)/2;
        consolelog(a,b,c,d,start);
        consolelog("e");
        return newton3(a,b,c,d,start);
    }else{//[a+fp- or a-fp+]solution on the right side
        var start = q+(q-p)/2;
        consolelog("f");
        return newton3(a,b,c,d,start);
    }
};


var bezierX = function(A,B,x){
    var a = 3*A[0]-3*B[0]+1;
    var b = -6*A[0]+3*B[0];
    var c = 3*A[0];
    var d = -x;
    var t = solveCubic(a,b,c,d);
    if(isNaN(t)){
        console.log(A,B,x);
        console.log(a,b,c,d);
    }
    var y = t*(3*A[1])+t*t*(-6*A[1]+3*B[1])+t*t*t*(3*A[1]-3*B[1]+1);
    return y;
};


var consolelog = function(){
    if(false){
        console.log.apply(null,arguments);
    }
};





var start = 0;

var a = function(t){
    if(start === 0)start = t;
    var stop = 1000;
    var t1 = (t%(1000+stop))/1000;
    if(t1 > 1){
        t1 = 1;
    }

    document.getElementById("testdiv").style.width =
    //Math.floor(bezierX([0.54,0.24],[0.27,0.97],t1)*300)+"px";
    Math.floor(bezierX([0.6633333333333333, -0.30000000000000004],[0.18333333333333332, 1.22],t1)*300)+"px";
    requestAnimationFrame(a);
}

requestAnimationFrame(a);
