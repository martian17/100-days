var findGradients = function(arr){
    //special cases
    //1 point
    if(arr.length === 0){
        return [];
    }else if(arr.length === 1){
        return [0];
    }else if(arr.length === 2){
        var s = [(arr[1][1]-arr[0][1])/(arr[1][0]-arr[0][0])];
        return [s,s];
    }else if(arr.length === 3){
        var a = arr[0];
        var b = arr[1];
        var c = arr[2];
        var sl1 = 2*(b[1]-a[1])/(b[0]-a[0])-(c[1]-a[1])/(c[0]-a[0]);
        var sl2 = (c[1]-a[1])/(c[0]-a[0]);
        var sl3 = 2*(c[1]-b[1])/(c[0]-b[0])-(c[1]-a[1])/(c[0]-a[0]);
        return [sl1,sl2,sl3];
    }else if(arr.length > 3){
        var len = arr.length;
        var vals = [];
        var a = arr[0];
        var b = arr[1];
        var c = arr[2];
        var d = arr[3];
        var sl1 = 2*(b[1]-a[1])/(b[0]-a[0])-(c[1]-a[1])/(c[0]-a[0]);
        var sl2 = (2*(c[1]-b[1])/(c[0]-b[0])-(d[1]-b[1])/(d[0]-b[0])+(b[1]-a[1])/(b[0]-a[0]))/2;
        vals.push(sl1);
        vals.push(sl2);

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
            vals.push(slope);
        }

        var a = arr[len-1];
        var b = arr[len-2];
        var c = arr[len-3];
        var d = arr[len-4];
        var sl1 = (2*(c[1]-b[1])/(c[0]-b[0])-(d[1]-b[1])/(d[0]-b[0])+(b[1]-a[1])/(b[0]-a[0]))/2;
        var sl2 = (2*(b[1]-a[1])/(b[0]-a[0])-(c[1]-a[1])/(c[0]-a[0]));
        vals.push(sl1);
        vals.push(sl2);
        return vals;
    }
};
