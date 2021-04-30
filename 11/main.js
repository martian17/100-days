var shift = function(data){
    for(var i = 0; i < height-1; i++){
        for(var j = 0; j < width*4; j++){
            data[i*width*4+j] = data[(i+1)*width*4+j];
        }
    }
    //no return. mutation
};


var insertLineToData = function(state,data,i){
    //i is the row which it iterates on
    for(var j = 0; j < width; j++){
        data[i*width*4+j*4+0] = (1-state[j])*255;
        data[i*width*4+j*4+1] = (1-state[j])*255;
        data[i*width*4+j*4+2] = (1-state[j])*255;
        data[i*width*4+j*4+3] = 255;
    }
    //modifies, so no return
};


var calcStep = function(state,rule){
    var ruleArr = ("0000000"+rule
    .toString(2)).slice(-8)
    .split("")
    .map(function(a){return a==="0"?0:1;}).reverse();
    //console.log(ruleArr);

    var previous = state[width-1];
    var current = state[0];
    var first = state[0];
    //i is the row which it iterates on
    for(var j = 0; j < width-1; j++){
        state[j] = ruleArr[previous*4+current*2+state[j+1]];
        previous = current;
        current = state[j+1];
    }
    state[width-1] = ruleArr[previous*4+current*2+first];
    //just changes the state, so no iteration here
};



var canvas = document.createElement("canvas");
var width = 1500;
var height = 500;
canvas.width = width;
canvas.height = height;
document.body.appendChild(canvas);

var ctx = canvas.getContext("2d");


var imageData = ctx.getImageData(0,0,width,height);


var state = [];
for(var i = 0; i < width; i++){
    state[i] = 0;
}
state[200] = 1;
var rule = 30;

var counter = 0;
var iterate = function(t){
    //console.log(counter,state);
    var i = counter;
    if(counter >= height){
        i = height - 1;
        shift(imageData.data);
    }
    insertLineToData(state,imageData.data,i);
    //console.log(imageData.data);
    ctx.putImageData(imageData,0,0);
    calcStep(state,rule);
    counter++;
    requestAnimationFrame(iterate);
};
requestAnimationFrame(iterate);



//events

document.getElementById("rule-no").value = rule;

document.getElementById("rule-execute").addEventListener("click",
function(e){
    rule = parseInt(document.getElementById("rule-no").value)
});
