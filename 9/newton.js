
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
        x += -fx/slope;
    }
    return x;
};


var solveCubic = function(a,b,c,d){
    if(a === 0){//quadratic
        if(b === 0){//linear
            if(c === 0){//degenerate straight horizontal line
                console.log("degenerate");
                return [0];
            }
            return [-d/c];
        }
        var det = c*c-4*b*d;
        if(det < 0){//no real solution, return the min/max
            return [-c/(2*b)];
        }
        //real solution
        det = Math.sqrt(det);
        return [(-c-det)/(2*b),(-c+det)/(2*b)];
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
    if(det1 < 0){//single solution
        var start = -b2/a2;
        return [newton3(a,b,c,d,start)];
    }
    //two winding peaks
    det1 = Math.sqrt(det1);
    var p = (-b1-det1)/(2*a1);
    var q = (-b1+det1)/(2*a1);//local min max
    var fp = a*p*p*p+b*p*p+c*p+d;
    var fq = a*q*q*q+b*q*q+c*q+d;
    if(fp*fq < 0){//pq different sign, three solutions
        var start1 = p-(q-p)/2;
        var start2 = (p+q)/2;
        var start3 = q+(q-p)/2;
        return [newton3(a,b,c,d,start1),newton3(a,b,c,d,start2),newton3(a,b,c,d,start3)];
    }else if(a*fp > 0){//[a+fp+ or a-fp-]solution on the left side
        var start = p-(q-p)/2;
        return [newton3(a,b,c,d,start)];
    }else{//[a+fp- or a-fp+]solution on the right side
        var start = q+(q-p)/2;
        return [newton3(a,b,c,d,start)];
    }
};




//test

console.log("linear");
console.log(solveCubic(0,0,3,1));

console.log("cubic");
console.log(solveCubic(1,2.8,1,1));
console.log(solveCubic(1,2.8,0,0));

console.log("quadratic");
console.log(solveCubic(0,1,1,-0.4));