

var canvas = document.createElement("canvas");
var width = 500;
var height = 700;
canvas.width = width;
canvas.height = height;
document.body.appendChild(canvas);

var ctx = canvas.getContext("2d");


var render = function(){
    
    var itrs = 20;
    
    var x = 250;
    var y = 250;
    var span = 0.1;//3px
    var stack = [0];
    ctx.beginPath();
    ctx.moveTo(x,y);
    ctx.strokeStyle = "#0001";
    for(var i = 0; i < itrs; i++){
        for(var j = 0; j < stack.length; j++){
            if(stack[j] === 0){//draw right
                x += span;
            }else if(stack[j] === 1){//draw bottom
                y += span;
            }else if(stack[j] === 2){//draw left
                x -= span;
            }else{//draw top
                y -= span;
            }
            ctx.lineTo(x,y);
        }
        var len = stack.length;
        for(var j = 0; j < len; j++){
            stack[len+j] = (stack[j]+1)%4;
        }
    }
    console.log(stack)
    
    ctx.stroke();
    
};

render();