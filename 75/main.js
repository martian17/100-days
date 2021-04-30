var Dots = function(canvas){
    var width = canvas.width;
    var height = canvas.height;
    var ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#fff5";
    var dots = [];
    for(var i = 0; i < 30; i++){
        dots.push([Math.random(),Math.random(),(Math.random()-0.5)*0.00002,(Math.random()-0.5)*0.00002]);
    }

    var start = 0;
    var iterate = function(t){
        if(start === 0)start = t;
        var dt = t - start;
        start = t;

        for(var i = 0; i < dots.length; i++){
            dots[i][0] = (dots[i][0]+dots[i][2]*dt+10)%1;
            dots[i][1] = (dots[i][1]+dots[i][3]*dt+10)%1;
        }

        render();

        if(isAnimate){
            requestAnimationFrame(iterate);
        }
    };

    var dist = function(a,b){
        var dx = b[0]-a[0];
        var dy = b[1]-a[1];
        return Math.sqrt(Math.abs(dx*dx+dy*dy));
    };
    var zoom = function(a){
        return (a-0.5)*1.1+0.5;
    }

    var render = function(){
        ctx.clearRect(0,0,width,height);
        for(var i = 0; i < dots.length; i++){
            var x1 = zoom(dots[i][0])*width;
            var y1 = zoom(dots[i][1])*height;
            ctx.beginPath();
            ctx.arc(x1,y1,1,0,6.28);
            ctx.closePath();
            ctx.stroke();
            for(var j = 0; j < dots.length; j++){
                var x2 = zoom(dots[j][0])*width;
                var y2 = zoom(dots[j][1])*height;
                if(dist([x1,y1],[x2,y2]) < 0.2*width){
                    ctx.beginPath();
                    ctx.moveTo(x1,y1);
                    ctx.lineTo(x2,y2);
                    ctx.stroke();
                }
            }
        }
    };


    var isAnimate = false;
    this.play = function(){
        isAnimate = true;
        start = 0;
        requestAnimationFrame(iterate);
    };

    this.stop = function(){
        isAnimate = false;
    };
};


var canvas = document.createElement("canvas");
canvas.width = document.body.offsetWidth;
canvas.height = document.body.offsetWidth*0.6;

document.body.appendChild(canvas);

var dots = new Dots(canvas);
dots.play();