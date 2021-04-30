

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

    cummed = cummed.map(c=>assign(variables,c));

    console.log(JSON.stringify(cummed));
};


var copy = function(a){
    return JSON.parse(JSON.stringify(a));
};


[
    ["+",["*",["+",["*",["id","m1"],["+",["*",["-",["id","l1"]],["sin",["id","t1"]],["^",["id","t1d"],["id","2"]]],["*",["id","l1"],["cos",["id","t1"]],["id","t1dd"]],["*",["-",["id","l2"]],["sin",["id","t2"]],["^",["id","t2d"],["id","2"]]],["*",["id","l2"],["cos",["id","t2"]],["id","t2dd"]]]],["*",["id","m2"],["id","x2dd"]],["*",["-",["id","g"]],["+",["id","m1"],["id","m2"]]]],["*",["id","l1"],["cos",["id","t1"]]]],["-",["*",["+",["*",["id","m1"],["+",["*",["-",["id","l1"]],["cos",["id","t1"]],["^",["id","t1d"],["id","2"]]],["*",["-",["id","l1"]],["sin",["id","t1"]],["id","t1dd"]],["*",["-",["id","l2"]],["cos",["id","t2"]],["^",["id","t2d"],["id","2"]]],["*",["-",["id","l2"]],["sin",["id","t2"]],["id","t2dd"]]]],["*",["id","m2"],["id","y2dd"]]],["*",["id","l1"],["sin",["id","t1"]]]]]],
    ["+",["*",["+",["*",["id","m2"],["id","x2dd"]],["-",["id","m2g"]]],["+",["+",["*",["id","l1"],["cos",["id","t1"]]],["*",["id","l2"],["cos",["id","t2"]]]],["-",["*",["id","l1"],["cos",["id","t1"]]]]]],["-",["*",["*",["id","m2"],["id","y2dd"]],["+",["+",["*",["id","l1"],["sin",["id","t1"]]],["*",["id","l2"],["sin",["id","t2"]]]],["-",["*",["id","l1"],["sin",["id","t1"]]]]]]]]
]



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


var expand = function(eq,negativity){
    //if plus, then return a list of terms
    if(eq[0] === "-"){
        return expand(eq[1],!negativity);
    }else if(eq[0] === "*"){
        var arr = [];
        var first = false;
        for(var i = 1; i < eq.length; i++){
            var ans = expand(eq[i],negativity);
            if(first){
                arr = ans;
            }else{
                var arr1 = [];
                for(var j = 0; j < arr.length; j++){
                    for(var k = 0; k < ans.length; k++){
                        arr1.push(multiply(arr[j],arr[k]));
                    }
                }
                arr = arr1;
            }
        }
        return arr;
    }else if(eq[0] === "+"){
        var arr = [];
        for(var i = 1; i < eq.length; i++){
            var ans = expand(eq[i],negativity);
            for(var j = 0; j < ans.length; j++){
                arr.push(ans[j]);
            }
        }
        return arr;
    }else{
        return [negativity,eq];
    }
};

var multiply = function(eq1,eq2){
    var sign = eq1[0]?!eq2[0]?eq2[0];
    var eq = [sign];
    for(var i = 1; i < eq1.length; i++){
        eq.push(eq1[i]);
    }
    for(var i = 1; i < eq2.length; i++){
        eq.push(eq2[i]);
    }
    return eq;
};



calcButton.e.addEventListener("click",calc);