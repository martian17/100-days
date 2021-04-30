var canvas = document.createElement("canvas");
document.body.appendChild(canvas);

var width = 500;
var height = 500;
canvas.width = width;
canvas.height = height;

var ctx = canvas.getContext("2d");
var IDT = ctx.getImageData(0,0,width,height);
var data = IDT.data;


var Scurve = function(n){
    if(n === 1){
        return [3,0,1];
    }else{
        var sub = Scurve(n-1);
        var len = sub.length;
        var arr = [];
        for(var i = 0; i < len; i++){
            var c = sub[i];
            if(c === 0){
                arr.push(3);
            }else if(c === 1){
                arr.push(2);
            }else if(c === 2){
                arr.push(1);
            }else if(c === 3){
                arr.push(0);
            }
        }
        arr.push(3);
        for(var i = 0; i < len; i++){
            var c = sub[i];
            arr.push(c);
        }
        arr.push(0);
        for(var i = 0; i < len; i++){
            var c = sub[i];
            arr.push(c);
        }
        arr.push(1);
        for(var i = 0; i < len; i++){
            var c = sub[i];
            if(c === 0){
                arr.push(1);
            }else if(c === 1){
                arr.push(0);
            }else if(c === 2){
                arr.push(3);
            }else if(c === 3){
                arr.push(2);
            }
        }
        return arr;
    }
}




var renderCurve = function(n,wid){
    var stride = wid/((2**n)-1);

    var coord = [50,wid+50];
    var curve = Scurve(n);
    ctx.clearRect(0,0,width,height);
    ctx.beginPath();
    ctx.moveTo(coord[0],coord[1]);
    for(var i = 0; i < curve.length; i++){
        var c = curve[i];
        if(c === 0){
            coord[0] += stride;
        }else if(c === 1){
            coord[1] += stride;
        }else if(c === 2){
            coord[0] -= stride;
        }else if(c === 3){
            coord[1] -= stride;
        }
        ctx.lineTo(coord[0],coord[1]);
    }
    ctx.stroke();
}

renderCurve(4,400);
