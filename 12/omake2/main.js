var img = document.getElementById("img");


var start = 0;

var sigma = 0;

var animate = function(t){
    if(t === 0)start = t;
    var dt = t - start;
    var t1 = t + sigma;

    var itv = 353;
    var tv = (t1%itv)/itv;
    var y = bezierXY([0.5,1],[0.5,1],0,tv);
    img.style.bottom = Math.floor(y*50)+"px";
    requestAnimationFrame(animate);
};

requestAnimationFrame(animate);


document.getElementById("sigma")
.addEventListener("input",
function(e){
    sigma = parseInt(this.value);
});
