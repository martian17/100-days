

//equation input
var textarea = body.add("textarea",false,"class:t1");

var calcButton = body.add("input",false,"type:button;class:i1");

var outputText = body.add("textarea",false,"class:t2");

textarea.e.value = `

cummed d=-a*(b+c)/(d*e)-d;


`;



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

var peek = function(arr){
    var res = arr.pop();
    arr.push(res);
    return res;
};

var parse = function(t){
    var ts = lex(t);
    var parsed = ["root"];
    var stack = [];
    stack.push(parsed);
    console.log(ts);
    //outputText.e.value = JSON.stringify(ts);
    //root multi
    //( ->) single
    //^ multi
    //- (prefix) single
    //* multi
    /// single
    //+ multi
    
    var priorities = {
        "^":2,
        "-":3,
        "/":4,
        "*":5,
        "+":6,
        "root":10,
        "(":20
    };
    
    for(var i = 0; i < ts.length; i++){
        //console.log(ts[i]);
        var top = peek(stack);
        if(ts[i][0].match(/[\/\-]/)){
            var frame = [ts[i][0]];
            top.push(frame);
            stack.push(frame);
        }else if(ts[i][0].match(/[\^\*\+]/)){
            var rank1 = priorities[ts[i][0]];
            var rank2 = priorities[top[0]];
            console.log(ts[i][0],top[0]);
            if(rank2 < rank1){//bubble up
                stack.pop();
                i--;
            }else if(rank1 === rank2){
                //do nothing, let it be
            }else if(rank2 > rank1){
                if(top.length === 1){
                    console.log("warning, no preceding token before + or * etc");
                    var frame = [ts[i][0]];
                    top.push(frame);
                    stack.push(frame);
                }else{
                    var frame = [ts[i][0]];
                    frame.push(top.pop());
                    top.push(frame);
                    stack.push(frame);
                }
            }
        }else if(ts[i][0] === "("){
            var frame = ["("];
            top.push(frame);
            stack.push(frame);
        }else if(ts[i][0] === ")"){
            if(top[0] === "("){
                stack.pop();
            }else if(top[0] === "root"){
                console.log("error: unclosed parenthesis");
                return false;
            }else{
                //bubble up
                stack.pop();
                i--;
            }
        }else if(ts[i][0] === "id"){
            console.log(ts[i]);
            top.push(ts[i]);
        }
    }
    
    console.log(parsed);
    outputText.e.value = JSON.stringify(parsed);
    return ts;
};

var lex = function(t){
    var tokens = [];
    var token = "";
    for(var i = 0; i < t.length; i++){
        if(t[i].match(/[\s]/)){
            if(token !== "")tokens.push(["id",token]);
            token = "";
        }else if(t[i].match(/[\(\)\^\/\*\+\-]/)){
            if(t[i] === "-"){
                if(token !== "")tokens.push(["id",token]);
                token = "";
                tokens.push(["+","+"]);
                tokens.push(["-","-"]);
            }else if(t[i] === "/"){
                if(token !== "")tokens.push(["id",token]);
                token = "";
                tokens.push(["*","*"]);
                tokens.push(["/","/"]);
            }else{
                if(token !== "")tokens.push(["id",token]);
                token = "";
                tokens.push([t[i],t[i]]);
            }
        }else{
            token += t[i];
        }
    }
    if(token !== "")tokens.push(["id",token]);
    console.log(tokens);
    return tokens;
};

var cleanAST= function(ast){
    if(ast[0] === "root" | ast[0] === "("){
        if(ast.length === 1){
            //nothing to parse
            console.log("nothing to parse");
            return false;
        }else if(ast.length === 2){
            //success
            return cleanAST(ast[1]);
        }else{
            console.log("parse error");
            return false;
        }
    }else if(ast[0].match(/[\^\*\+]/)){
        if(ast.length === 1){
            console.log("parse error: dead branch");
            return false;
        }else if(ast.length === 2){
            return cleanAST(ast[1]);
        }else{
            for(var i = 1; i < ast.length; i++){
                ast[i] = cleanAST(ast[i]);
                if(ast[i] === false)return false;
            }
            return ast;
        }
    }else if(ast[0].match(/[\/\-]/)){
        if(ast.length === 1){
            //nothing to parse
            console.log("nothing to parse");
            return false;
        }else if(ast.length === 2){
            //success
            ast[1] = cleanAST(ast[1]);
            if(ast[1] === false)return false;
            return ast;
        }else{
            console.log("parse error");
            return false;
        }
    }else if(typeof ast === "object"){
        for(var i = 1; i < ast.length; i++){
            ast[i] = cleanAST(ast[i]);
            if(ast[i] === false)return false;
        }
        return ast;
    }else{
        if(typeof ast === "string")return ast;
        return false;
    }
}

calcButton.e.addEventListener("click",calc);