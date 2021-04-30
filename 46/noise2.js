
var squash1 = function(a){
    return 1/(1+Math.pow(Math.E,-4*(a-0.5)));
}


var generateKernel = function(n){
    var kernel = [];
    for(var i = 0; i < n; i++){
        kernel[i] = 0;
    }
    var kernels = [];

    var itr = 0;
    while(true){
        itr++;
        if(itr > 1000){
            console.log("loop");
            break;
        }
        for(var i = 0; i < n-1; i++){
            if(kernel[i] > 2){
                kernel[i] = 0;
                kernel[i+1]++;
            }
        }
        if(kernel[n-1] > 2){
            break;
        }
        kernels.push(kernel.map(a=>a-1));
        kernel[0]++;
    }
    return kernels;
}


var gauss = function(arr,dims,n){//destructive on arr
    //classical blur
    var buffer = arr.map(a=>0);//#may cause bug
    var ndim = dims.length;
    var dimweights = [1];
    //constructing dimweights
    for(var i = 1; i < ndim; i++){
        dimweights[i] = dimweights[i-1]*dims[i-1];
    }

    //generates the kernel
    var kernel = generateKernel(ndim);
    for(var ii = 0; ii < n; ii++){
    var stack = dims.map(a=>0);//position in the field
    for(var i = 0; i < arr.length; i++){
        if(!(stack[j] < dims[j])){
            console.log("this can't be happening. missmatch between arr.length and ndim dimension")
        }
        //using the kernel to blur
        var sumnum = 0;
        var sum = 0;
        for(var j = 0; j < kernel.length; j++){
            var broken = false;
            var idx = 0;
            for(var k = 0; k < ndim; k++){
                var dimcoord = stack[k]+kernel[j][k];
                if(dimcoord < 0 || !(dimcoord < dims[k])){//if out of expented range
                    //do nothing
                    broken = true;
                    break;
                }else{
                    idx += dimweights[k]*dimcoord;
                }
            }
            if(broken){
                //do nothing
            }else{
                sum += arr[idx];
                sumnum++;
            }
            buffer[i] = sum/sumnum;
        }
        var temp = buffer;
        buffer = arr;
        arr = temp;

        stack[ndim-1]++;
        for(var j = ndim-1; j > 0; j--){
            if(!(stack[j] < dims[j])){//if equal of bigger
                stack[j] = 0;
                stack[j-1]++;
            }
        }

    }
    }
    console.log(arr);
    return arr;
};

var blur = function(dims,r){
    var mul = dims.reduce((a,b)=>a*b);
    var arr = [];
    for(var i = 0; i < mul; i++){
        arr[i] = Math.random();
    }
    return gauss(arr,dims,3);
    /*
    var ndim = dims.length;
    var pp = 3;
    var planck = Math.sqrt(pp);
    var mul = dims.map(a=>a/r*planck).reduce((a,b)=>a*b);
    var arr = [];
    for(var i = 0; i < mul.length; mul++){
        arr[i] = Math.random();
    }
    gauss(arr,dims,r);

    var arr1 = [];
    var mul0 = dims.reduce((a,b)=>a*b);
    var stack = dims.map(a=>0);//position in the field
    for(var i = 0; i < mul0; i++){
        for(var j = 0; j < ndim; j++){
            var ncoord = stack[j]/r*planck;

        }

        stack[ndim-1]++;
        for(var j = ndim-1; j > 0; j--){
            if(!(stack[j] < dims[j])){//if equal of bigger
                stack[j] = 0;
                stack[j-1]++;
            }
        }
    }*/
}
