

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
tags.add("div","リスク/期間");
tags.add("div","リスク/日");

tags.add("div","保険金合計額");
tags.add("div","失敗回数");
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
    for(var i = 0; i < 12; i++){
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
saveArea.e.value = `AB7/E7WA	7/1/2020	7/1/2021	  301,898,915   	$290,684,220	1
E65WA	7/1/2020	7/1/2021	  289,599,375   	$270,043,685	1
E8WB	7/1/2020	7/1/2021	  277,475,732   	$260,907,232	1
W7/E36B	7/1/2020	7/1/2021	  262,750,667   	$246,997,685	1
E117WA (S8)	7/1/2020	7/1/2021	  230,092,982   	$214,344,610	1
E172B	7/1/2020	7/1/2021	  228,954,531   	$215,797,096	1
Ka-sat 9A	7/1/2020	7/1/2021	  210,311,593   	$192,212,822	1
E7C	7/1/2020	7/1/2021	  197,165,856   	$186,948,823	1
E36C	7/1/2020	7/1/2021	  184,003,736   	$184,003,736	1
E3B	7/1/2020	7/1/2021	  181,992,019   	$168,411,959	1
W5A/E70B	7/1/2020	7/1/2021	  177,495,234   	$163,339,485	1
W6A/E21B	7/1/2020	7/1/2021	  172,701,584   	$159,428,807	1
W3D/E3D	7/1/2020	7/1/2021	  169,978,852   	 160,197,909 	1
E117WB (S9)	7/1/2020	7/1/2021	  164,325,069   	$153,234,198	1
W3C/E16A	7/1/2020	7/1/2021	  163,219,514   	$148,528,364	1
KONNECT	1/16/2021	7/1/2021	  205,653,248   	$192,268,181	1
E9B	7/1/2020	7/1/2021	  144,227,110   	$137,129,164	1
E115WB (S7)	7/1/2020	7/1/2021	  140,520,920   	$130,761,058	1
W2A/E10A	7/1/2020	7/1/2021	  113,642,860   	$101,932,335	1
E113WA (S6)	7/1/2020	7/1/2021	  66,607,783   	$47,822,774	1`;

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
//addRow();
//addRow();
//addRow();

load(saveArea.e.value);






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
            var risk = riskClasses[row[5].trim()];//risk
            var successday = Math.pow(1-risk,1/(end-start));
            row[5] = row[5];//risk class
            row[6] = risk;//risk
            row[7] = 1-successday;//riskday
            row[8] = 0;//moneysum
            row[9] = 0;//failure sum
            
            return row;
        }
    );
    
    var trials = 1000000;
    var threshold = 175000000;
    var maximum = 925000000;
    //parallelizable
    //actual simulation
    var moneysum = 0;
    for(var i = 0; i < trials; i++){
        var moneysum1 = calcOneRound(data);
        if(moneysum1 > threshold){
            if(moneysum1 > maximum)moneysum1 = maximum;
            moneysum += moneysum1-threshold;
        }
    }
    //formatting data outputs
    data = data.map(
        function(row){
            row[6] = row[6]*100;
            row[7] = row[7]*100;
            row[10] = row[8]/trials;//avg money
            row[11] = row[9]/trials*100;//failure %
            return row;
        }
    );
    var moneyavg = moneysum/trials;
    console.log(moneyavg);
    
    //outputting the data
    for(var i = 0; i < data.length; i++){
        rows[i][6].e.value = data[i][6];
        rows[i][7].e.value = data[i][7];
        rows[i][8].e.value = data[i][8];
        rows[i][9].e.value = data[i][9];
        rows[i][10].e.value = data[i][10];
        rows[i][11].e.value = data[i][11];
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
        var riskday = sat[7];//riskday
        var riskall = sat[6];
        
        //nenwari
        if(accident(riskall)){
            //console.log("fail");
            var r = Math.random();
            var money = edmoney+r*(stmoney-edmoney);
            sat[8] += money;
            sat[9]++;
            moneysum += money;
        }
        
        //hiwari
        /*
        for(var i = start; i < end; i++){
            if(accident(riskday)){
                console.log("fail");
                var money = stmoney+((i-start)/(end-start))*(edmoney - stmoney);
                sat[8] += money;
                moneysum += money;
                sat[9]++;
                break;
            }
        }
        */
    }
    return moneysum;
};


simulateButton.e.addEventListener("click",
function(){
    simulate();
});
