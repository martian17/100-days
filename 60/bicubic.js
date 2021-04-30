var spline = function(f0,f1,f0d,f1d,x){
    var a = 2*f0-2*f1+f0d+f1d;
    var b = -3*f0+3*f1-2*f0d-f1d;
    var c = f0d;
    var d = f0;
    return a*x*x*x+b*x*x+c*x+d;
}

var bicubic = function(arr,w,h,ww,hh){//ww hh are the return width height
    var result = [];
    for(var y = 0; y < hh; y++){
        for(var x = 0; x < ww; x++){
            var idxx = Math.floor(x/ww*(w-1));
            var idxy = Math.floor(y/hh*(h-1));
            var tl = arr[idxx+w*idxy];
            var tr = arr[(idxx+1)+w*idxy];
            var bl = arr[idxx+w*(idxy+1)];
            var br = arr[(idxx+1)+w*(idxy+1)];

            var dx = x/ww*(w-1)-idxx;
            var dy = y/hh*(h-1)-idxy;

            //top spline
            var f0 = spline(0,0,tl[0],tr[0],dx);
            var f1 = spline(0,0,bl[0],br[0],dx);
            var f0d = tl[1]+dx*(tr[1]-tl[1]);
            var f1d = bl[1]+dx*(br[1]-bl[1]);

            result.push(spline(f0,f1,f0d,f1d,dy));
        }
    }
    return result;
}
