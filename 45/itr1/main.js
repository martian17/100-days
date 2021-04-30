

var Noise = function(w,h,r){
    var arr = [];
    for(var i = 0; i < h; i++){
        for(var j = 0; j < w; j++){
            arr[i*w+j] = Math.random();//0 to 1
        }
    }
    return gauss(w,h,r,arr);
}


var gauss = function(w,h,r,arr){//destructive on arr
    var buffer = arr.map(a=>0);//#may cause bug

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


var canvasM = body.add("canvas");
var canvas = canvasM.e;

var width = 500;
var height = 500;
canvas.width = width;
canvas.height = height;

var ctx = canvas.getContext("2d");
var IDT = ctx.getImageData(0,0,width,height);
var data = IDT.data;

var noise = Noise(width,height,3);

for(var i = 0; i < noise.length; i++){
    data[i*4+3] = Math.floor(noise[i]*256);
}
ctx.putImageData(IDT,0,0);
