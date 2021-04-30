

var parsePly = function(ply){
    var lines = ply.split("\n");
    var flag = false;
    var i;
    var elems = [];
    var last;
    for(i = 0; i < lines.length; i++){
        var split = lines[i].split(" ");
        if(split[0] === "element"){
            var name = split[1];
            var n = parseInt(split[2]);
            last = [name,n,[]];
            elems.push(last);
        }else if(split[0] === "comment"){
            //do nothing
        }else if(split[0] === "property"){
            last[2].push(lines[i]);
        }else if(lines[i].trim() === "end_header"){
            break;
        }
    }
    i++;
    //now i is the starting line for the values

    //j is the index in the elems
    for(var j = 0; j < elems.length; j++){
        var elem = elems[j];
        var length = elem[1];
        var start = i;
        var values = [];
        elem[3] = values;
        if(start+length > lines.length){
            console.log("parsing error, not enough lines");
            return false;
        }
        for(i; i < start+length; i++){
            values[i-start] =
            lines[i]
            .trim()
            .split(" ")
            .map(a=>{
                return parseFloat(a);
            });
        }
    }

    return elems;
};

var plyToPolygon = function(elems){
    var vertex;
    var face;
    for(var i = 0; i < elems.length; i++){
        if(elems[i][0] === "vertex"){
            vertex = elems[i];
        }else if(elems[i][0] === "face"){
            face = elems[i];
        }
    }
    return [vertex,face];
};

var refinePolygon = function(polygon){
    var vertex = polygon[0];
    var face = polygon[1];

    //vertex start
    var props = vertex[2];
    var propmap = [];
    for(var i = 0; i < props.length; i++){
        if(props[i].trim() === "property float x"){
            propmap[0] = i;
        }else if(props[i].trim() === "property float y"){
            propmap[1] = i;
        }else if(props[i].trim() === "property float z"){
            propmap[2] = i;
        }
    }

    console.log(propmap);
    var vertex1 = vertex[3]
    .map(a=>{
        var vert = [];
        for(var i = 0; i < propmap.length; i++){
            vert[i] = a[propmap[i]];
            if(isNaN(vert[i])){
                console.log("NaN in vert. Terminating");
                return false;
            }
        }
        return vert;
    });
    //vertex complete

    //face start
    //only triangles
    var face1 = face[3]
    .map(a=>{
        if(a.filter(a=>{return isNaN(a)}).length !== 0){
            console.log("NaN in face. Terminating");
            console.log(a);
            return false;
        }
        return a.splice(a.length-3);
    });
    //face end

    return [vertex1,face1];
};


var poly = refinePolygon(plyToPolygon(parsePly(zip3)));

console.log(poly);
var scene = new Scene();
document.body.appendChild(scene.canvas);
scene.add(poly);
scene.render([0,-0.1,0,0,0,0]);
var n = 0;
var m = 0;
var r = 0.3;
setInterval(function(){
    n+=0.05*2;
    m = Math.sin(n*3)/5;
    scene.render([r*Math.cos(n)*Math.cos(m),r*Math.sin(n)*Math.cos(m),r*Math.sin(m),n+Math.PI/2,-m,0]);
},100);
