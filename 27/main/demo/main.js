var start = 0;

var a = function(t){
    if(start === 0)start = t;
    var stop = 1000;
    var t1 = (t%(1000+stop))/1000;
    if(t1 > 1){
        t1 = 1;
    }

    document.getElementById("testdiv").style.width =
    //Math.floor(bezierX([0.54,0.24],[0.27,0.97],t1)*300)+"px";
    Math.floor(bezierX([0.6633333333333333, -0.30000000000000004],[0.18333333333333332, 1.22],t1)*300)+"px";
    //Math.floor(bezierX([0, 0.44999999999999996], [0.7866666666666666, 1.2533333333333334],t1)*300)+"px";
    requestAnimationFrame(a);
}

requestAnimationFrame(a);
