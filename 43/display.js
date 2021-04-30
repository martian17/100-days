var AA = [1, 0.6666666666666667];
var BB = [0, 0.7666666666666666];

var Display = function(){
    var wrapper = Elem("div",false,false,"position:relative");
    this.wrapper = wrapper;
    var canvas = document.createElement("canvas");
    wrapper.appendChild(canvas);
    canvas.width = 500;
    canvas.height = 500;
    var ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.ctx = ctx;

    var width = 500;
    var height = 500;
    var S = [100,400];
    var E = [400,100];

    var itr = 0;

    var SEXY = function(xy){
        var x = S[0]+xy[0]*(E[0]-S[0]);
        var y = S[1]+xy[1]*(E[1]-S[1]);
        return [x,y];
    };

    var A,B,A1,B1,R=10;
    this.setAB = function(A0,B0){
        A = A0;
        B = B0;
        A1 = SEXY(A);
        B1 = SEXY(B);
    };

    var buttonRadius = 10;
    var Button = function(color,radius){
        return Elem("div",false,false,
        "width:"+(2*radius)+"px;"+
        "height:"+(2*radius)+"px;"+
        "background-color:"+color+";"+
        "position:absolute;border-radius:50%;");
    }
    var leftButton = Button("#f0f",buttonRadius);
    var rightButton = Button("#0ff",buttonRadius);
    wrapper.appendChild(leftButton);
    wrapper.appendChild(rightButton);

    var display = Elem("div",false,false,
    "font-size:30px;");
    wrapper.appendChild(display);


    this.render = function(){//A is ctrl1 B is ctrl2
        AA = A;
        BB = B;
        width = canvas.width;
        height = canvas.height;
        ctx.clearRect(0,0,width,height);
        ctx.beginPath();
        ctx.moveTo(S[0],S[1]);

        //console.log(A,B);
        var dx = 0.01;
        for(var x = 0; x < 1; x+=dx){
            var y = bezierXY(A,B,0,x);
            var x1 = S[0]+x*(E[0]-S[0]);
            var y1 = S[1]+y*(E[1]-S[1]);
            ctx.lineTo(x1,y1);
        }

        ctx.lineTo(E[0],S[1]);
        ctx.stroke();

        //rendering lines and control points

        //rendering lines
        ctx.beginPath();
        ctx.moveTo(S[0],S[1]);
        ctx.lineTo(A1[0],A1[1]);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(B1[0],B1[1]);
        ctx.lineTo(E[0],S[1]);
        ctx.stroke();

        //rendering control points
        //now moving the physical points
        leftButton.style.left = (A1[0]-buttonRadius)+"px";
        leftButton.style.top = (A1[1]-buttonRadius)+"px";

        rightButton.style.left = (B1[0]-buttonRadius)+"px";
        rightButton.style.top = (B1[1]-buttonRadius)+"px";

        var round = function(n){
            var mo = 100000;
            return Math.floor(n*mo)/mo;
        }
        //renew the display
        display.innerHTML = "[["+round(A[0])+","+round(A[1])+"],["+round(B[0])+","+round(B[1])+"]]";
    };




    var dist2 = function(a,b){
        var dx = b[0] - a[0];
        var dy = b[1] - a[1];
        return dx*dx+dy*dy;
    };

    var moving = false;
    var clkOffset = [0,0];
    leftButton.addEventListener("mousedown",function(e){
        var canvasBound =   canvas.getBoundingClientRect();
        var canvasTop = canvasBound.top+scrollY;
        var canvasLeft = canvasBound.left+scrollX;
        var localx = e.clientX+scrollX-canvasTop;
        var localy = e.clientY+scrollY-canvasLeft;
        var x = (localx-S[0])/(E[0]-S[0]);
        var y = (localy-E[1])/(E[1]-S[1]);
        //if
        moving = "A";
        clkOffset = [localx-A1[0],localy-A1[1]];
    });

    rightButton.addEventListener("mousedown",function(e){
        var canvasBound =   canvas.getBoundingClientRect();
        var canvasTop = canvasBound.top+scrollY;
        var canvasLeft = canvasBound.left+scrollX;
        var localx = e.clientX+scrollX-canvasTop;
        var localy = e.clientY+scrollY-canvasLeft;
        console.log(e.clientY,scrollY,canvas.offsetTop);
        console.log(localx,localy);
        var x = (localx-S[0])/(E[0]-S[0]);
        var y = (localy-E[1])/(E[1]-S[1])+1;
        //if
        moving = "B";
        clkOffset = [localx-B1[0],localy-B1[1]];
    });
    document.body.addEventListener("mouseup",function(){
        moving = false;
    });
    document.body.addEventListener("mousemove",function(e){
        if(!moving)return false;
        var canvasBound =   canvas.getBoundingClientRect();
        var canvasTop = canvasBound.top+scrollY;
        var canvasLeft = canvasBound.left+scrollX;
        var localx = e.clientX+scrollX-canvasTop-clkOffset[0];
        var localy = e.clientY+scrollY-canvasLeft-clkOffset[1];
        var x = (localx-S[0])/(E[0]-S[0]);
        var y = (localy-E[1])/(E[1]-S[1])+1;
        if(x < 0) x = 0;
        if(x > 1) x = 1;
        if(moving === "A"){
            A = [x,y];
            A1 = SEXY(A);
        }else if(moving === "B"){
            B = [x,y];
            B1 = SEXY(B);
        }
        this.render();
    }.bind(this));
};





var display = new Display();
var wrapper = display.wrapper;
var ctx = display.ctx;
document.body.appendChild(wrapper);
//display.setAB([0.17,0.67],[0.83,0.67]);
//display.setAB([0.17, 0.67],[0.45666666666666667, 0.5333333333333333]);
//display.setAB([0.17, 0.67],[0.47, 0.09333333333333338]);
//display.setAB([0.14, 0.5933333333333333],[0.47, 0.09333333333333338]);
//display.setAB([0.15333333333333332, -0.21333333333333337],[0.47, 0.09333333333333338]);
//display.setAB([1, 0.6666666666666667],[0, 0.7666666666666666]);
display.setAB([0,-0.42],[0.12,-0.43]);
//display.setAB();
//display.setAB();
display.render();
