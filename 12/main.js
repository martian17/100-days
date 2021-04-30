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
        var color = 0;
        if(Math.floor(j/scale) > stateWidth-1){
            color = 255;
        }else if(scale > 0){
            color = (1-state[Math.floor(j/scale)])*255;
        }else{
            var s = -scale;
            var sum = 0;
            for(var k = 0; k < s; k++){
                sum += state[j*s+k];
            }
            color = Math.floor((1-(sum/s/s))*255);
        }
        data[i*width*4+j*4+0] = color;
        data[i*width*4+j*4+1] = color;
        data[i*width*4+j*4+2] = color;
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

    var previous = state[stateWidth-1];
    var current = state[0];
    var first = state[0];
    //i is the row which it iterates on
    for(var j = 0; j < stateWidth-1; j++){
        state[j] = ruleArr[previous*4+current*2+state[j+1]];
        previous = current;
        current = state[j+1];
    }
    state[stateWidth-1] = ruleArr[previous*4+current*2+first];
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


var resetState = function(s){
    for(var i = 0; i < stateWidth; i++){
        s[i] = 0;
    }
};


var scale = -1;//larger the more coarse
var stateWidth = scale>0?Math.floor(width/scale):-width*scale;

var state = [];
var sumstate = [];
resetState(state);
resetState(sumstate);

state[200] = 1;
var rule = 30;

var accumulateSum = function(){
    for(var i = 0; i < stateWidth; i++){
        sumstate[i] += state[i];
    }
};


var counter = 0;
var iterate = function(t){
    //console.log(counter,state);
    if(scale > 0){
        var i = counter;
        if(counter >= height){
            i = height - 1;
            shift(imageData.data);
        }
        if((counter+1)%scale === 0){
            insertLineToData(state,imageData.data,i);
            //console.log(imageData.data);
            ctx.putImageData(imageData,0,0);
            calcStep(state,rule);
        }else{
            insertLineToData(state,imageData.data,i);
            ctx.putImageData(imageData,0,0);
        }
    }else{
        var s = -scale;
        var i = counter;
        if(counter >= height){
            i = height - 1;
            shift(imageData.data);
        }
        accumulateSum();
        //console.log(imageData.data);
        for(var j = 0; j < s-1; j++){
            calcStep(state,rule);
            accumulateSum();
        }
        insertLineToData(sumstate,imageData.data,i);
        ctx.putImageData(imageData,0,0);
        resetState(sumstate);
        calcStep(state,rule);
    }
    counter++;
    requestAnimationFrame(iterate);
};
requestAnimationFrame(iterate);
//setInterval(iterate,1000);


//events

document.getElementById("rule-no").value = rule;

document.getElementById("rule-execute").addEventListener("click",
function(e){
    rule = parseInt(document.getElementById("rule-no").value)
});



var changeScale = function(s){
    var old = scale;
    scale = s;//larger the more coarse
    var oldWidth = stateWidth;
    stateWidth = scale>0?Math.floor(width/scale):-width*scale;
    if(oldWidth < stateWidth){
        for(var i = oldWidth; i < stateWidth; i++){
            state[i] = 0;
            sumstate[i] = 0;
        }
    }
};





var scaleInput = function(){
    var s = parseInt(this.value);
    if(s < 0){
        s -= 1;
        document.getElementById("scale-value").innerHTML = "x1/"+(-s);
    }else{
        s += 1;
        document.getElementById("scale-value").innerHTML = "x"+s;
    }
    changeScale(s);
};
document.getElementById("scale").
addEventListener("input",scaleInput);


document.getElementById("scale").value=scale<0?scale+1:scale-1;
scaleInput.bind(document.getElementById("scale"))();
