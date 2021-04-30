var img = document.getElementById("img");


var start = 0;


var animate = function(t){
    if(t === 0)start = t;
    var dt = t - start;

    var itv = 353;
    var tv = (t%itv)/itv;
    var y = bezierXY(AA,BB,0,tv);
    img.style.width = "100px";
    img.style.height = (200+Math.floor(y*50))+"px";
    //img.style.transform="scale(1,"+(1-y)+")";
    requestAnimationFrame(animate);
};

requestAnimationFrame(animate);
