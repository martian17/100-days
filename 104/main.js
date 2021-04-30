var canvas = document.createElement("canvas");
var width = 255;
var height = 255;
canvas.width = width;
canvas.height = height;
var ctx = canvas.getContext("2d");
var imgdata = ctx.getImageData(0,0,width,height);
var data = imgdata.data;
document.body.appendChild(canvas);

var x0 = 255;
var y0 = 255;

const ColorScheme = function(conds){
    this.get = function(val){
        for(let i = 1; i < conds.length; i++){
            var cond1 = conds[i];
            if(cond1[0] >= val){
                const cond0 = conds[i-1];
                const s = (cond1[0]-cond0[0]);
                const q = (val - cond0[0])/s;
                const r = (cond1[0] - val)/s;
                return [
                    Math.floor(cond0[1][0]*r+cond1[1][0]*q),
                    Math.floor(cond0[1][1]*r+cond1[1][1]*q),
                    Math.floor(cond0[1][2]*r+cond1[1][2]*q),
                    Math.floor(cond0[1][3]*r+cond1[1][3]*q)
                ];
            }
        }
    }
};

const heat = new ColorScheme([
    [0,[0,0,0,255]],
    [1/6,[0,0,255,255]],
    [2/6,[0,255,255,255]],
    [3/6,[0,255,0,255]],
    [4/6,[255,255,0,255]],
    [5/6,[255,0,0,255]],
    [1,[255,255,255,255]]
]);

var render = function(){
    var len0 = Math.hypot(x0,y0);
    for(var x = 1; x < width; x++){
        for(var y = 1; y < height; y++){
            var len1 = Math.hypot(x,y);
            var similarity = (x*x0+y*y0)/(len0*len1)*(len0>len1?len1/len0:len0/len1);
            similarity = similarity > 1 ? 1 : similarity;
            similarity = similarity < 0 ? 0 : similarity;

            //console.log((x*x0+y*y0)/(len0*len1),similarity);
            var color = heat.get(similarity);
            var idx = (x+y*width)*4;
            data[idx] = color[0];
            data[idx+1] = color[1];
            data[idx+2] = color[2];
            data[idx+3] = color[3];
        }
    }
    ctx.putImageData(imgdata,0,0);
}

render();

canvas.addEventListener("mousemove",function(e){
    x0 = e.clientX+scrollX-canvas.offsetLeft;
    y0 = e.clientY+scrollY-canvas.offsetTop;
    x0 = x0<1?1:x0;
    y0 = y0<1?1:y0;
    render();
});