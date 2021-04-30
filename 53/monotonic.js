var monotonicGradient = function(arr){
    var len = arr.length;
    var ds = [];
    for(var i = 0; i < len-1; i++){
        ds[i] = (arr[i+1][1]-arr[i][1])/(arr[i+1][0]-arr[i][0]);
    }
    var ms = [];
    ms[0] = ds[0];
    for(var i = 1; i < len-1; i++){
        if(ds[i-1]*ds[i] < 0){
            ms[i] = 0;
        }else if(ds[i-1] === 0 || ds[i] === 0){
            ms[i] = 0;
        }else{
            ms[i] = (ds[i-1]+ds[i])/2;
        }
    }
    ms[len-1] = ds[len-2];

    return ms;
}
