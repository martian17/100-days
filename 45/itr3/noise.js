
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


var gauss = function(arr,dims,r){//destructive on arr
    //classical blur
    var buffer = arr.map(a=>0);//#may cause bug
    var ndim = dims.length;

    //generates the kernel
    var kernel = generateKernel(ndim);

    var stack = dims.map(a=>0);
    for(var i = 0; i < arr.length; i++){
        stack[ndim-1]++;
        for(var j = ndim-1; j > 0; j--){
            if(!(stack[j] < ndim[j])){
                stack[j] = 0;
                stack[j-1]++;
            }else{
                break;
            }
        }
        //all combination of increment and decrement coordinates
        //wow isnt this a hypercube?
        var kn = 0;
        for(var j = 0; j < kernel.length; j++){
            kn++;
            for(var k = 0; k < ndim; k++){
                var kpidx = kernel[j][k]+stack[k];
                if(kpidx < 0 || !(kpidx < dims[k])){
                    //index does not exist
                    kn--;
                    break;
                }
            }
        }
    }

    for(var ii = 0; ii < r; ii++){

        //optimizeable by differentiating between boundary and non boundary
        for(var i = 0; i < h; i++){
            for(var j = 0; j < w; j++){
                /*var idx = i*w+j;
                var up = (i-1)*w+j;
                var down = (i+1)*w+j;
                var left = i*w+j-1;
                var right = i*w+j+1;*/
                var idx = i*w+j;
                var up = ((i-1+h)%h)*w+j;
                var down = ((i+1)%h)*w+j;
                var left = i*w+(j-1+w)%w;
                var right = i*w+(j+1)%w;
                //average the cross five
                //buffer[idx] = (arr[idx]+arr[up]+arr[down]+arr[left]+arr[right])/5;
                //buffer[idx] = Math.pow(arr[idx]*arr[up]*arr[down]*arr[left]*arr[right],1/5);
                buffer[idx] = (arr[idx]+arr[up]+arr[down]+arr[left]+arr[right])/5;
            }
        }
        var temp = buffer;
        buffer = arr;
        arr = temp;
    }
    return arr;
};


var blur = function(w,h,r){
    //original image will be ceil of int multiple of r
    var pp = 20;
    var planck = Math.sqrt(pp);
    //iteration will be planck^2

    var wc = Math.ceil(w/r*planck)+1;
    var hc = Math.ceil(h/r*planck)+1;
    //this will be the original image size

    var arr = [];
    for(var i = 0; i < hc*wc; i++){
            arr[i] = Math.random();
    }
    gauss(wc,hc,Math.round(planck*planck),arr);

    //expansion
    //map functions
    console.log(arr,1/r*planck);

    var arr1 = [];
    for(var i = 0; i < h; i++){
        for(var j = 0; j < w; j++){
            var tw = j/r*planck;
            var th = i/r*planck;
            var twf = Math.floor(tw);
            var thf = Math.floor(th);
            var twc = Math.ceil(tw);
            var thc = Math.ceil(th);
            var offw = tw-twf;
            var offh = th-thf;
            var tl = arr[thf*wc+twf];
            var tr = arr[thf*wc+twc];
            var bl = arr[thc*wc+twf];
            var br = arr[thc*wc+twc];
            arr1[i*w+j] = squash1((((tl*(1-offw)+tr*offw)*(1-offh)+(bl*(1-offw)+br*offw)*offh)-0.5)*Math.sqrt(pp)+0.5);
            //arr1[i*w+j] = tl;
            //weighted average
        }
    }
    console.log(arr1);
    return arr1;
}
