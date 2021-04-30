var img = document.getElementById("img");


var start = 0;


var animate = function(t){
    if(t === 0)start = t;
    var dt = t - start;

    var itv = 353;
    var tv = (t%itv)/itv;
    var y = bezierXY([0.5,1],[0.5,1],0,tv);
    img.style.bottom = Math.floor(y*50)+"px";
    requestAnimationFrame(animate);
};

requestAnimationFrame(animate);
