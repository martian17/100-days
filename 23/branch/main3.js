

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
sperm x2dd = -l1*sin(t1)*t1d^2+l1*cos(t1)*t1dd-l2*sin(t2)*t2d^2+l2*cos(t2)*t2dd;
sperm y2dd = -l1*cos(t1)*t1d^2-l1*sin(t1)*t1dd-l2*cos(t2)*t2d^2-l2*sin(t2)*t2dd;


cummed (m1*x1dd+m2*x2dd-g*(m1+m2))*(y1) = (m1*y1dd+m2*y2dd)*(x1);
cummed (m2*x2dd-m2g)*(y2-y1) = (m2*y2dd)*(x2-x1);
//cummed indicates the target

//coagulate t1dd;
//coagulate t2dd;

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

            cummed.push(["+",a[0],["-",a[1]]]);
        }else if(a.slice(0,5) === "sperm"){
            a = a.slice(5).split("=").map(a=>a.trim());

            variables[a[0]] = parse(a[1]);
        }
    });
    console.log(JSON.stringify(variables));
    console.log(JSON.stringify(cummed));

    //cummed = cummed.map(c=>stringify(cleanAST(expand(reducePower(assign(variables,c),false)))));
    cummed = cummed.map(c=>splitTerms(expand(reducePower(assign(variables,c),false))),["t1dd","t2dd"]);

    console.log();
    //true->negatie false->positive
    console.log(JSON.stringify(cummed));
};


var copy = function(a){
    return JSON.parse(JSON.stringify(a));
};


[
    ["+",["*",["+",["*",["id","m1"],["+",["*",["-",["id","l1"]],["sin",["id","t1"]],["^",["id","t1d"],["id","2"]]],["*",["id","l1"],["cos",["id","t1"]],["id","t1dd"]],["*",["-",["id","l2"]],["sin",["id","t2"]],["^",["id","t2d"],["id","2"]]],["*",["id","l2"],["cos",["id","t2"]],["id","t2dd"]]]],["*",["id","m2"],["id","x2dd"]],["*",["-",["id","g"]],["+",["id","m1"],["id","m2"]]]],["*",["id","l1"],["cos",["id","t1"]]]],["-",["*",["+",["*",["id","m1"],["+",["*",["-",["id","l1"]],["cos",["id","t1"]],["^",["id","t1d"],["id","2"]]],["*",["-",["id","l1"]],["sin",["id","t1"]],["id","t1dd"]],["*",["-",["id","l2"]],["cos",["id","t2"]],["^",["id","t2d"],["id","2"]]],["*",["-",["id","l2"]],["sin",["id","t2"]],["id","t2dd"]]]],["*",["id","m2"],["id","y2dd"]]],["*",["id","l1"],["sin",["id","t1"]]]]]],
    ["+",["*",["+",["*",["id","m2"],["id","x2dd"]],["-",["id","m2g"]]],["+",["+",["*",["id","l1"],["cos",["id","t1"]]],["*",["id","l2"],["cos",["id","t2"]]]],["-",["*",["id","l1"],["cos",["id","t1"]]]]]],["-",["*",["*",["id","m2"],["id","y2dd"]],["+",["+",["*",["id","l1"],["sin",["id","t1"]]],["*",["id","l2"],["sin",["id","t2"]]]],["-",["*",["id","l1"],["sin",["id","t1"]]]]]]]]
]


var coagualte = function(){

}

var assign = function(variables,eq){
    if(eq[0] === "id"){
        if(eq[1] in variables){
            //replace
            return copy(variables[eq[1]]);
        }else{
            //don't replace
            return eq;
        }
    }else{
        for(var i = 1; i < eq.length; i++){
            eq[i] = assign(variables,eq[i]);
        }
        return eq;
    }
};

//format
//returns [+ [-[*...]][*...]...];


var expand = function(eq){
    if(eq[0] === "-"){//----//
        var result = expand(eq[1]);
        for(var i = 1; i < result.length; i++){
            if(result[i][0] === "-"){
                result[i] = result[i][1];
            }else{
                result[i] = ["-",result[i]];
            }
        }
        return result;
    }else if(eq[0] === "*"){//----//
        var result;
        var first = true;
        for(var i = 1; i < eq.length; i++){
            var result1 = expand(eq[i]);
            if(first){
                first = false;
                result = result1;
            }else{
                var result2 = ["+"];
                for(var j = 1; j < result.length; j++){
                    for(var k = 1; k < result1.length; k++){
                        result2.push(multiply(result[j],result1[k]));
                    }
                }
                result = result2;
            }
        }
        return result;
    }else if(eq[0] === "+"){//----//
        var result = ["+"];
        for(var i = 1; i < eq.length; i++){
            var result1 = expand(eq[i]);
            for(var j = 1; j < result1.length; j++){
                result.push(result1[j]);
            }
        }
        return result;
    }else if(eq[0] === "id" || eq[0] === "num"){//----//
        return ["+",["*",eq]];
    }else{//other functions
        for(var i = 1; i < eq.length; i++){
            eq[i] = expand(eq[i]);
        }
        return ["+",["*",eq]];
    }
};

var isInt = function(n){
    return n%1 === 0;
}

var reducePower = function(eq){
    if(eq[0] = "^" && eq[2][0] === "num" && eq.length === 3 && isInt(eq[2][1])){
        //only operate on int
        var num = eq[2][1];
        var result = ["*"];
        var reduced = reducePower(eq[1]);
        for(var i = 0; i < num; i++){
            result.push(copy(reduced));
        }
        return result;
    }else if(eq[0] === "id" || eq[0] === "num"){
        return eq;
    }else{//other functions
        for(var i = 1; i < eq.length; i++){
            eq[i] = reducePower(eq[i]);
        }
        return eq;
    }
};


var multiply = function(eq1,eq2){
    var a = eq1[0] === "-";
    var b = eq2[0] === "-";
    var negative = a===b?false:true;
    if(a)eq1 = eq1[1];
    if(b)eq2 = eq2[1];
    var result = ["*"];
    for(var i = 1; i < eq1.length; i++){
        result.push(eq1[i]);
    }
    for(var i = 1; i < eq2.length; i++){
        result.push(eq2[i]);
    }
    if(negative){
        return ["-",result];
    }else{
        return result;
    }
};



//eq format follows output from expand
//[+ [*...][-[*...]]]
var splitTerms = function(eq,vars){
    var termized = ["+"];
    for(var i = 0; i < vars.length; i++){
        var result = selectTerm(eq,vars[i]);
        //["+",varterm, other terms]
        termized.push(result[1]);
        eq = result[2];
    }
    termized.push(eq);
    return termized;
};

var selectTerm = function(eq,var){
    if(eq[0] !== "+"){
        console.log("error, expecting plus clause, got something else");
        return false;
    }
    var qualified = ["+"];
    var disqualified = ["+"];
    for(var i = 1; i < eq.length; i++){
        var broken = false;
        var term = eq[i];
        if(eq[i][0] === "-"){
            term = eq[i][1];
        }
        for(var j = 1; j < term.length; j++){
            if(term[j][0] === "id" && term[j][1] === var){
                //found the term looking for
                qualified.push(eq[i]);//term is without the sign
                broken = true;
                break;
            }
        }
        if(!broken)disqualified.push(eq[i]);
    }
    //compact qualified terms
    return["+",compact(qualified),disqualified];
}

var compact = function(eq){//one dimensional compaction
    var variables = [];
}



calcButton.e.addEventListener("click",calc);


//var result = expand(["-",["*",["+",["-",["id","a"]],["id","b"]],["+",["id","c"],["id","d"]]]],false);

//console.log(result);

var before = "(a-b+(c+d)*(sin((i+j)/(k+l))+f))*(g-h)";
console.log(before);

var parsed = parse(before);
console.log(parsed);

var expanded = expand(parsed);
console.log(expanded);

var string = stringify(expanded);
console.log(string);







