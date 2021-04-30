

//equation input
var textarea = body.add("textarea",false,"class:t1");

var calcButton = body.add("input",false,"type:button;class:i1");

var outputText = body.add("textarea",false,"class:t2");



var calc = function(){
    var variables = {};
    var cummed = [];
    var val = textarea.e.value;
    val.split("\n")
    .map(function(a){
        return a.trim();
    })
    .filter(function(a){
        if(a.slice(0,2) === "//"){
            return false;
        }
        return true;
    })
    .join("")
    .split(";")
    .map(function(a){
        //classify
        if(a.slice(0,6) === "cummed"){
            a = a.slice(6).split("=").map(a=>parse(a.trim()));
            
            cummed.push(termize(["+",a[0],invert(a[1])]));
        }else if(a.slice(5) === "sperm"){
            a = a.slice(5).split("=").map(a=>a.trim());
            
            variables[a[0]] = parse(a[1]);
            
            
            variables.push(a);
        }
    });
    console.log(variables);
};

var termize = function(a){
    return a;
}


var invert = function(a){
    return a;
}

var parse = function(t){
    var ts = lex(t);
    var parsed = [];
    var stack = [];
    stack.push(parsed);
    console.log(ts);
    outputText.e.value = JSON.stringify(ts);
    return ts;
    /*for(var i = 0; i < ts.length; i++){
        var current = stack.pop();
        stack.push(current);
        if(ts[i][0] === "("){
            var st = ["(",[]];
            current.push(st);
            stack.push(st[1]);
        }else if(ts[i][0] === ")"){
            stack.pop();
        }else if(ts[i][0] === "id"){
            if(i+1 === ts.length){
                current.push(ts[i]);
            }else{
                switch(ts[i+1][0]){
                    case "+":
                    
                    break;
                }
            }
            current.push(ts[i]);
        }
    }*/
};

var lex = function(t){
    var tokens = [];
    var token = "";
    for(var i = 0; i < t.length; i++){
        if(t[i].match(/[\s]/)){
            if(token !== "")tokens.push(["id",token]);
            token = "";
        }else if(t[i].match(/[\(\)\^\*\+\-]/)){
            if(token !== "")tokens.push(["id",token]);
            token = "";
            tokens.push([t[i],t[i]]);
        }else{
            token += t[i];
        }
    }
    return tokens;
}

calcButton.e.addEventListener("click",calc);