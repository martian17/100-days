var spline = function(f0,f1,f0d,f1d,x){
    var a = 2*f0-2*f1+f0d+f1d;
    var b = -3*f0+3*f1-2*f0d-f1d;
    var c = f0d;
    var d = f0;
    return a*x*x*x+b*x*x+c*x+d;
}

var bicubic = function(itn,gra,w,h,ww,hh){//ww hh are the return width height
    var result = [];
    for(var y = 0; y < hh; y++){
        for(var x = 0; x < ww; x++){
            var idxx = Math.floor(x/ww*(w-1));
            var idxy = Math.floor(y/hh*(h-1));
            var tl = idxx+w*idxy;
            var tr = (idxx+1)+w*idxy;
            var bl = idxx+w*(idxy+1);
            var br = (idxx+1)+w*(idxy+1);

            var dx = x/ww*(w-1)-idxx;
            var dy = y/hh*(h-1)-idxy;

            //top spline
            var f0 = spline(itn[tl],itn[tr],gra[tl][0],gra[tr][0],dx);
            var f1 = spline(itn[bl],itn[br],gra[bl][0],gra[br][0],dx);
            var f0d = gra[tl][1]+dx*(gra[tr][1]-gra[tl][1]);
            var f1d = gra[bl][1]+dx*(gra[br][1]-gra[bl][1]);

            result.push(spline(f0,f1,f0d,f1d,dy));
        }
    }
    return result;
}
