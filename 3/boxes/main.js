
data = data.split("\n")
.filter(function(a){if(a.match(/\S/)){return true}else{return false}})
.map(function(a){return a.split(",")})
.map(function(a){
    a[0] = a[0].split("/").map(function(a){return parseInt(a)});
    a[1] = a[1].split(":").map(function(a){return parseInt(a)});
    a[2] = parseInt(a[2]);
    return a;
});


var PlotGraph = function(obj){//creates a new canvas
    var width = obj.size[0];
    var height = obj.size[1];
    var offsetWidth = width+obj.offsetx[0]+obj.offsetx[1];
    var offsetHeight = height+obj.offsety[0]+obj.offsety[1];
    var rangex = obj.rangex;
    var rangey = obj.rangey;
    var scalex = width/(rangex[1]-rangex[0]);
    var scaley = height/(rangey[1]-rangey[0]);
    var offsetx = obj.offsetx[0];
    var offsety = obj.offsety[1];
    var labelx = obj.labelx;
    var labely = obj.labely;
    var vertical = obj.vertical;
    var horizontal = obj.horizontal;


    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.ctx = ctx;
    canvas.width = offsetWidth;
    canvas.height = offsetHeight;


    this.render = function(){//render non-essential contents
        //drawing the vertical line
        ctx.strokeStyle = "#000";
        ctx.beginPath();
        ctx.moveTo(offsetx,offsety);
        ctx.lineTo(offsetx,offsety+height);
        ctx.stroke();
        //drawing the horizontal line
        ctx.beginPath();
        ctx.moveTo(offsetx,offsety+height);
        ctx.lineTo(offsetx+width,offsety+height);
        ctx.stroke();
        //drawing labely
        ctx.fillText(labely,0,20);
        //drawing labelx
        ctx.fillText(labelx,offsetx+width,offsety+height);
        //drawing the horizontal numbers
        if(horizontal.numberInterval){
            var interval = horizontal.numberInterval;
            var range = horizontal.numberRange;
            for(var i = range[0]; i <= range[1]; i+=interval){
                ctx.fillText(i,offsetx+(i-rangex[0])*scalex-3,offsety+height+20);
            }
        }
        //drawing the vertical numbers
        if(vertical.numberInterval){
            var interval = vertical.numberInterval;
            var range = vertical.numberRange;
            for(var i = range[0]; i <= range[1]; i+=interval){
                ctx.fillText(i,0,offsety+height-((i-rangey[0])*scaley));
            }
        }
        ctx.strokeStyle = "#0004";
        //drawing the horizontal axis lines
        if(horizontal.lineInterval){
            var interval = horizontal.lineInterval;
            var range = horizontal.lineRange;
            for(var i = range[0]; i <= range[1]; i+=interval){
                ctx.beginPath();
                ctx.moveTo(offsetx+(i-rangex[0])*scalex,offsety);
                ctx.lineTo(offsetx+(i-rangex[0])*scalex,offsety+height);
                ctx.stroke();
            }
        }
        //drawing the vertical axis lines
        if(vertical.lineInterval){
            var interval = vertical.lineInterval;
            var range = vertical.lineRange;
            for(var i = range[0]; i <= range[1]; i+=interval){
                ctx.beginPath();
                ctx.moveTo(offsetx,offsety+height-((i-rangey[0])*scaley));
                ctx.lineTo(offsetx+width,offsety+height-((i-rangey[0])*scaley));
                ctx.stroke();
            }
        }

    };
    ctx.strokeStyle = "#000";

    this.plotPoint = function(coord,color){
        var x = (coord[0]-rangex[0])*scalex+offsetx;
        var y = offsety+height-(coord[1]-rangey[0])*scaley;
        ctx.beginPath();
        ctx.arc(x,y,3,0,Math.PI*2);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
    };
    this.plotBox = function(coord,color,bwidth,bheight){
        var x = (coord[0]-rangex[0])*scalex+offsetx;
        var y = offsety+height-(coord[1]-rangey[0])*scaley;
        //console.log(coord);
        bwidth = bwidth*scalex;
        bheight = bheight*scaley;
        ctx.beginPath();
        ctx.rect(x,y-bheight/2,bwidth,bheight);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
    };

    this.clear = function(){
        ctx.clearRect(0,0,width,height);
    }

};

var graph = new PlotGraph(
    {
        vertical:{
            numberInterval:1000,
            numberRange:[0,6000],
            lineInterval:1000,
            lineRange:[0,6000],
        },
        horizontal:{
            numberInterval:1,
            numberRange:[0,23],
            lineInterval:1,
            lineRange:[0,24],
        },
        size:[500,300],
        rangex:[0,24],
        rangey:[0,6000],
        offsetx:[30,50],
        offsety:[30,30],
        labelx:"時刻",
        labely:"電力(Kw)"
    }
);


document.body.appendChild(graph.canvas);
graph.clear();
graph.render();
for(var i = 0; i < data.length; i++){
    var x = data[i][1][0];
    var y = data[i][2];
    //console.log(x,y);
    graph.plotBox([x,y],"#ff000022",1,100);
}
