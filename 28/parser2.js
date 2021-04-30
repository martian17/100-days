var peek = function(arr){
    var res = arr.pop();
    arr.push(res);
    return res;
};

var parse = function(t){
    var ts = lexNumbers(lex(t));
    var parsed = ["root"];
    var stack = [];
    stack.push(parsed);
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

    var funcName = "";

    for(var i = 0; i < ts.length; i++){
        //console.log(ts[i]);
        var top = peek(stack);
        if(ts[i][0].match(/[\/\-]/)){
            var frame = [ts[i][0]];
            top.push(frame);
            stack.push(frame);
        }else if(ts[i][0].match(/[\^\*\+]/)){
            var rank1 = priorities[ts[i][0]];
            var rank2 = top[0][0] === "("?priorities["("]:priorities[top[0]];
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
            var frame = ["("+funcName];
            funcName = "";
            top.push(frame);
            stack.push(frame);
        }else if(ts[i][0] === ")"){
            if(top[0][0] === "("){
                if(top[0] === "("){
                    stack.pop();
                }else{
                    top[0] = top[0].slice(1);
                    stack.pop();
                }
            }else if(top[0] === "root"){
                console.log("error: unclosed parenthesis");
                return false;
            }else{
                //bubble up
                stack.pop();
                i--;
            }
        }else if(ts[i][0] === "id"){
            if(i+1 < ts.length && ts[i+1][0] === "("){
                //if not the last
                funcName = ts[i][1];
            }else{
                top.push(ts[i]);
            }
        }else if(ts[i][0] === "num"){
            top.push(ts[i]);
        }
    }
    parsed = cleanAST(parsed);

    outputText.e.value = JSON.stringify(parsed);
    return parsed;
};

["+",["*",["-",["id","a"]],["sin",["+",["id","b"],["id","c"]]],["/",["*",["id","d"],["id","e"]]]],["-",["id","d"]]]


/*var isInt = function(t){
    var tt = t.trim();
    if(tt === ""+(parseInt(tt))){
        return true;
    }
    return false;
};*/

//wrapper function of lex
var lexNumbers = function(tokens){
    for(var i = 0; i < tokens.length; i++){
        if(tokens[i][0] === "id"){
            if(!isNaN(tokens[i][1])){
                //check if int
                tokens[i] = ["num",parseFloat(tokens[i][1])];
            }
        }
    }
    return tokens;
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
    return tokens;
};

var cleanAST = function(ast){
    if(ast[0] === "root" | ast[0] === "("){
        if(ast.length === 1){
            //nothing to parse
            //console.log("nothing to parse");
            return ["num",0];
        }else if(ast.length === 2){
            //success
            return cleanAST(ast[1]);
        }else{
            console.log("parse error");
            return false;
        }
    }else if(ast[0].match(/[\^\*\+]/)){
        if(ast.length === 1){
            //console.log("parse error: dead branch");
            if(ast[0] === "+")return ["num",0];
            if(ast[0] === "*")return ["num",1];
            if(ast[0] === "^")return false;
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
            //console.log("nothing to parse");
            return ["num",0];
        }else if(ast.length === 2){
            //success
            ast[1] = cleanAST(ast[1]);
            if(ast[1] === false)return false;
            return ast;
        }else{
            console.log("parse error");
            return false;
        }
    }else if(ast[0] === "id" || ast[0] === "num"){
        return ast;
    }else{//some other function
        for(var i = 1; i < ast.length; i++){
            ast[i] = cleanAST(ast[i]);
            if(ast[i] === false)return false;
        }
        return ast;
    }
};



var stringify = function(eq){
    if(eq[0] === "+"){//------//
        var result = "";
        var i;
        for(i = 1; i < eq.length-1; i++){
            if(i+1 in eq && eq[i+1][0] === "-"){
                result += stringify(eq[i])+"";
            }else{
                result += stringify(eq[i])+"+";
            }
        }
        result += stringify(eq[i]);
        return result;
    }else if(eq[0] === "*"){//------//
        var result = "";
        var i;
        for(i = 1; i < eq.length-1; i++){
            var prefix = suffix1 = suffix2 = "";
            if(eq[i][0] === "+"){
                prefix = "(";
                suffix1 = ")";
            }
            if(i+1 in eq && eq[i+1][0] !== "/"){
                suffix2 = "*"
            }
            result += prefix+stringify(eq[i])+suffix1+suffix2;
        }
        if(eq[i][0] === "+"){
            result += "("+stringify(eq[i])+")";
        }else{
            result += stringify(eq[i]);
        }
        return result;
    }else if(eq[0] === "^"){//------//
        var result = "";
        var i;
        for(i = 1; i < eq.length-1; i++){
            if(eq[i][0] === "+" || eq[i][0] === "*"){
                result += "("+stringify(eq[i])+")^";
            }else{
                result += stringify(eq[i])+"^";
            }
        }
        if(eq[i][0] === "+" || eq[i][0] === "*"){
            result += "("+stringify(eq[i])+")";
        }else{
            result += stringify(eq[i]);
        }
        return result;
    }else if(eq[0] === "-"){//------//
        if(eq[1][0] === "+" || eq[1][0] === "^"){
            return "-("+stringify(eq[1])+")";
        }
        return "-"+stringify(eq[1]);
    }else if(eq[0] === "/"){//------//
        if(eq[1][0] === "*" || eq[1][0] === "+" || eq[1][0] === "^"){
            return "/("+stringify(eq[1])+")";
        }
        return "/"+stringify(eq[1]);
    }else if(eq[0] === "id"){//------//
        return eq[1];
    }else{//function
        var result = "";
        var i;
        for(i = 1; i < eq.length-1; i++){
            result += stringify(eq[i])+",";
        }
        return eq[0]+"("+result+stringify(eq[i])+")"
    }
};