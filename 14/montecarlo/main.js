

var wwrapper = body.add("div",false,"class:wwrapper;");

var tags = wwrapper.add("div",false,"class:tags;");


var wrapper = wwrapper.add("div",false,"class:wrapper");

//tag names
tags.add("div",false,"class:row-num;");//margin
tags.add("div","名前");
tags.add("div","リスククラス");
tags.add("div","開始日");
tags.add("div","終了日");
tags.add("div","開始保険金");
tags.add("div","終了保険金");
tags.add("div","保険金期待値");
tags.add("div","tag1");
tags.add("div","tag1");
tags.add("div","tag1");






var simulateButton = wwrapper.add("input",false,"type:button;value:run simulation;class:addrow;");
var plus = wwrapper.add("input",false,"type:button;value:+;class:addrow;");


var rows = [];

plus.e.addEventListener("click",function(){
    addRow();
});


var addRow = function(){
    var elem = wrapper.add("div");
    var n = rows.length+1;
    var num = elem.add("div",n+"","class:row-num");
    elem.e.num = num;
    var cols = [];
    for(var i = 0; i < 10; i++){
        var d = elem.add("div");
        var inp = d.add("input",false,"type:text;");
        cols.push(inp);
    }
    var minus = elem.add("input",false,"value:-;type:button;class:row-minus");
    minus.e.n = n;
    elem.e.minus = minus;
    minus.e.addEventListener("click",removeRow);
    rows.push(cols);
    return cols;
};

var removeRow = function(){
    var n = this.n;
    console.log(this);
    for(var i = n+1; i < rows.length; i++){
        rows[i][0].e.parentNode.parentNode.minus.e.n = i-1;
        rows[i][0].e.parentNode.parentNode.num.e.innerHTML = i-1;
    }
    rows.splice(n,1);
    var paren = this.parentNode;
    paren.parentNode.removeChild(paren);
};


//scroll syncing
wrapper.e.addEventListener("scroll",
function(){
    tags.e.style.transform = "translate("+(-this.scrollLeft)+"px)";
});



//save

var saveButton = wwrapper.add("input",false,"class:save-button;type:button;value:save;");
var loadButton = wwrapper.add("input",false,"class:load-button;type:button;value:load;");
var saveArea = wwrapper.add("textarea",false,"class:save-area");


var save = function(){
    var data = rowsToData(rows);
    var txt = toCopyable(data);
    saveArea.e.value = txt;
};

var rowsToData = function(rows){
    var data = [];
    for(var i = 0; i < rows.length; i++){
        data[i] = [];
        var cols = rows[i];
        for(var j = 0; j < cols.length; j++){
            var val = cols[j].e.value;
            data[i][j] = val;
        }
    }
    return data;
};

var toCopyable = function(d){
    var txt = "";
    for(var i = 0; i < d.length; i++){
        var r = d[i];
        var rt = "";
        for(var j = 0; j < r.length; j++){
            rt += r[j];
            rt += "	";
        }
        txt += rt.slice(0,-1)+"\n";
    }
    return txt.slice(0,-1);
};

saveButton.e.addEventListener("click",save);


//load

var load = function(txt){
    for(var i = 0; i < rows.length; i++){
        var row = rows[i][0].e.parentNode.parentNode;
        wrapper.e.removeChild(row);
    }
    rows = [];

    var data = txt.split("\n");
    data = data.map(function(t){
        var cs = [];
        var ct = "";
        var stflag = true;
        dbquote = false;
        for(var i = 0; i < t.length; i++){
            if(!dbquote && t[i] === "	"){
                cs.push(ct);
                ct = "";
                stflag = true;
                dbquote = false;
            }else if(stflag && t[i] === "\""){
                dbquote = true;
                ct += t[i];
                //console.log(ct);
            }else if(dbquote && t[i] === "\"" && t[i+1] === "	"){
                cs.push(ct.slice(1));
            }else{
                stflag = false;
                ct += t[i];
            }
        }
        //console.log(dbquote,ct,ct[ct.length-1])
        if(dbquote && ct[ct.length-1] === "\""){
            //console.log("sdfdf");
            cs.push(ct.slice(1,-1));
        }else{
            cs.push(ct);
        }
        //console.log(cs);
        return cs;
    });

    for(var i = 0; i < data.length; i++){
        var cols = addRow();
        for(var j = 0; j < cols.length; j++){
            cols[j].e.value = data[i][j];
        }
    }
};

loadButton.e.addEventListener("click",function(){
    load(saveArea.e.value);
});


//inits
addRow();
addRow();
addRow();








//doing simulation

//the failure rate of the whole duration
var riskClasses = {
    "1":0.7e-2,
    "2":0.7e-2,
    "3":0.7e-2
};


var dateDay = function(date){
    return Math.floor(new Date(date).getTime() / 1000/60/60/24);
};

var simulate = function(){
    var data = rowsToData(rows);
    for(var i = 0; i < data.length; i++){
        var row = data[i];
        var risk = riskClasses[row[1].trim()];
        var start = dateDay(row[2]);
        var end = dateDay(row[3]);
        var stmoney = parseInt(row[4]);
        var edmoney = parseInt(row[5]);

        rows[i][6].e.value = calculateExpected(risk,start,end,stmoney,edmoney);
    }
};

var accident = function(risk){
    return Math.random()<risk;
};

var calculateExpected = function(risk,start,end,stmoney,edmoney){
    var moneySum = 0;
    var successday = Math.pow(1-risk,1/(end-start));
    var riskday = 1-successday;
    console.log(riskday);
    console.log(risk,start,end,stmoney,edmoney);
    var trials = 10000;
    var cnt = 0;
    for(var ii = 0; ii < trials; ii++){
        for(var i = start; i < end; i++){
            if(accident(riskday)){
                cnt++;
                var money = stmoney+((i-start)/(end-start))*(edmoney - stmoney);
                moneySum+=money;
                break;
            }
        }
    }
    console.log(cnt);
    console.log(cnt/trials*100);
    return moneySum/trials;
};

simulateButton.e.addEventListener("click",
function(){
    simulate();
});
