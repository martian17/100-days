

var wwrapper = body.add("div",false,"class:wwrapper;");

var tags = wwrapper.add("div",false,"class:tags;");


var wrapper = wwrapper.add("div",false,"class:wrapper");

//tag names
tags.add("div",false,"class:row-num;");//margin
tags.add("div","名前");
tags.add("div","開始日");
tags.add("div","終了日");
tags.add("div","開始保険金");
tags.add("div","終了保険金");
tags.add("div","リスク区分");

tags.add("div","保険金期待値");
tags.add("div","失敗確率");






var simulateButton = wwrapper.add("input",false,"type:button;value:run simulation;class:addrow;");
var plus = wwrapper.add("input",false,"type:button;value:+;class:addrow;");


var rows = [];

plus.e.addEventListener("click",function(){
    addRow();
});


var addRow = function(){
    var elem = wrapper.add("div");
    var n = rows.length;
    var num = elem.add("div",(n+1)+"","class:row-num");
    elem.e.num = num;
    var cols = [];
    for(var i = 0; i < 8; i++){
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
        rows[i][0].e.parentNode.parentNode.num.e.innerHTML = i-1+1;//+1 because starts from 1
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
        if(row.parentNode === null)continue;
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

var myParseInt = function(n){
    return parseInt(n.replace(/[\,\$]/g,""));
};

var simulate = function(){
    var data = rowsToData(rows).map(
        function(row){
            row[1] = dateDay(row[1]);//start
            row[2] = dateDay(row[2]);//end
            row[3] = myParseInt(row[3]);//stmoney
            row[4] = myParseInt(row[4]);//edmoney
            //calculating risk per day
            var start = row[1];
            var end = row[2];
            var risk = riskClasses[row[5].trim()];//riskday
            var successday = Math.pow(1-risk,1/(end-start));
            row[5] = 1-successday;//riskday
            row[6] = 0;//moneysum
            row[7] = 0;//failure sum
            return row;
        }
    );
    
    var trials = 100;
    //parallelizable
    //actual simulation
    var moneysum = 0;
    for(var i = 0; i < trials; i++){
        var moneysum1 = calcOneRound(data);
        if(moneysum1 > 175000000){
            moneysum += moneysum1;
        }
    }
    //formatting data outputs
    data = data.map(
        function(row){
            row[6] = row[6]/trials;//avg money
            row[7] = row[7]/trials*100;//failure %
            return row;
        }
    );
    var moneyavg = moneysum/trials;
    console.log(moneyavg);
    
    //outputting the data
    for(var i = 0; i < data.length; i++){
        rows[i][6].e.value = data[i][6];
        rows[i][7].e.value = data[i][7];
    }
};

var accident = function(risk){
    return Math.random()<risk;
};


var calcOneRound = function(data){
    var moneysum = 0;
    for(var ii = 0; ii < data.length; ii++){
        var sat = data[ii];
        var start = sat[1];
        var end = sat[2];//end
        var stmoney = sat[3];//stmoney
        var edmoney = sat[4];//edmoney
        var riskday = sat[5];//riskday
        
        for(var i = start; i < end; i++){
            if(accident(riskday)){
                console.log("fail");
                var money = stmoney+((i-start)/(end-start))*(edmoney - stmoney);
                sat[6] += money;
                moneysum += money;
                sat[7]++;
                break;
            }
        }
    }
    return moneysum;
};


simulateButton.e.addEventListener("click",
function(){
    simulate();
});
