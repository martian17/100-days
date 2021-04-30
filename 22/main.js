

//equation input
var textarea = body.add("textarea",false,"class:t1");

var calcButton = body.add("input",false,"type:button;class:i1");

var outputText = body.add("textarea",false,"class:t2");

textarea.e.value = `

sperm x1 = l1*sin(t1);
sperm y1 = l1*cos(t1);
sperm x2 = l1*sin(t1)+l2*sin(t2);
sperm y2 = l1*cos(t1)+l2*cos(t2);

sperm x1d = l1*cos(t1)*t1d;
sperm t1d = -l1*sin(t1)*t1d;
sperm x2d = l1*cos(t1)*t1d+l2*cos(t2)*t2d;
sperm t2d = -l1*sin(t1)*t1d-l2*sin(t2)*t2d;

sperm x1dd = -l1*sin(t1)*t1d^2+l1*cos(t1)*t1dd;
sperm y1dd = -l1*cos(t1)*t1d^2-l1*sin(t1)*t1dd;
sperm x1dd = -l1*sin(t1)*t1d^2+l1*cos(t1)*t1dd-l2*sin(t2)*t2d^2+l2*cos(t2)*t2dd;
sperm y1dd = -l1*cos(t1)*t1d^2-l1*sin(t1)*t1dd-l2*cos(t2)*t2d^2-l2*sin(t2)*t2dd;


cummed (m1*x1dd+m2*x2dd-g*(m1+m2))*(y1) = (m1*y1dd+m2*y2dd)*(x1);
cummed (m2*x2dd-m2g)*(y2-y1) = (m2*y2dd)*(x2-x1);
//cummed indicates the target

//coagulate t1dd;
//coagulate t2dd;

impregnate();

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

var parse = function(t){
    var ts = lex(t);
    var parsed = ["root",null];
    var stack = [];
    stack.push(parsed);
    console.log(ts);
    outputText.e.value = JSON.stringify(ts);
    return ts;
    //root multi
    //( ->) single
    //^ multi
    //- (prefix) single
    //* multi
    /// single
    //+ multi
    
    var priorities = {
        "(":1,
        "^":2,
        "-":3,
        "/":4,
        "*":5,
        "+":6,
        "root":10
    };
    
    
    var ec = -10;
    var ifec = false;
    
    for(var i = 0; i < ts.length; i++){
        var current = stack.pop();//current frame
        stack.push(current);
        if(ts[i][0] === "-"){
            ec = 3;
            ifec = true;
            var frame = ["-",[]];
            current[1].push(frame);
        }else if(ts[i][0] === "id"){
            current[1].push(ts[i]);
            frame.push(ts[i]);
            //if(i+1 === ts.length)current[1].push(ts[i]);
        }else if(ts[i][0].match(/[\^\*\+]/)){
            var rank1 = priorities[ts[i][0]];
            var rank2 = priorities[current[0]];
            if(rank1 < rank2){
                //put the previous stuff in the current in the new frame
                var newFrame = [ts[i][0],[current]];
                stack.pop();
                stack.push(newFrame);
            }else if(rank1 === rank2){
                //same stuff, do nothing, then the next content will be in the
                //old frame
            }else if(rank1 > rank2){
                //get out of the old frame. traverse until rank lower
                stack.pop();
                i--;
                //propagation stops at the root.
            }
        }else if(ts[i][0].match(/[\/\-]/)){
            if(){
                
            }
        }
    }
    
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
            if(t[i] === "-"){
                if(token !== "")tokens.push(["id",token]);
                token = "";
                tokens.push("+","+");
                tokens.push("-","-");
            }else if(){
                if(token !== "")tokens.push(["id",token]);
                token = "";
                tokens.push("*","*");
                tokens.push("/","/");
            }else{
                if(token !== "")tokens.push(["id",token]);
                token = "";
                tokens.push([t[i],t[i]]);
            }
        }else{
            token += t[i];
        }
    }
    return tokens;
}

calcButton.e.addEventListener("click",calc);