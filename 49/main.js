



var Chart = function(){
    var canvas = document.createElement("canvas");
    var width = 500;
    var height = 500;
    canvas.width = width;
    canvas.height = height;
    this.canvas = canvas;
    var ctx = canvas.getContext("2d");
    this.setWidth = function(w){
        width = w;
        canvas.width = w;
    };
    this.setHeight = function(h){
        height = h;
        canvas.height = h;
    };
    this.clear = function(){
        canvas.clearRect(0,0,width,height);
    }
    this.drawChart = function(arr,low,high,col){
        var len = arr.length;
        ctx.beginPath();
        moveTo(low,0);
        for(var i = 0; i < len; i++){
            lineTo((high-low)/len*i,arr[i]);
        }
        lineTo(high,0);
        ctx.closePath();
        ctx.fillStyle = col;
        ctx.fill();
    }
    var xmin = 0;
    var ymin = 0;
    var xmax = 0;
    var ymax = 0;
    this.setRange = function(xmin0,ymin0,xmax0,ymax0){
        xmin = xmin0;
        ymin = ymin0;
        xmax = xmax0;
        ymax = ymax0;
    }
    var moveTo = function(x,y){
        ctx.moveTo(
            (x-xmin)/(xmax-xmin)*width,
            height-(y-ymin)/(ymax-ymin)*height
        );
    }
    var lineTo = function(x,y){
        ctx.lineTo(
            (x-xmin)/(xmax-xmin)*width,
            height-(y-ymin)/(ymax-ymin)*height
        );
    }
}




/*
var f1 = [];
var f2 = [];
for(var i = 0; i < 200; i++){
    f1[i] = i;
    f2[i] = 200-i;
}

chart.drawChart(f1,0,200,"#f00");
chart.drawChart(f2,0,200,"#0ff");*/



var peek = function(arr){
    var result = arr.pop();
    arr.push(result);
    return result;
}


var calcVals = function(){
    var healthy = [10000000];
    var incubation = [100];
    var incubationN = [100];
    var sick = [0];
    var sickN = [0];
    var noS = [0];//no symptom
    var noSN = [0];//no symptom
    var cured = [0];
    var dead = [0];

    var meet = 1;//people they meet
    var rate = 0.1;
    var symptomRate = 0.2;
    var mortalityRate = 0.1;

    var incstack = [100];

    //t is the day
    var simdays = 1000;
    for(var t = 0; t < simdays; t++){
        if(t === 80){
            meet = 0.2;
        }
        incubation.push(
            incubation[t]
            +healthy[t]*meet*rate*(incubation[t]+noS[t])/(healthy[t]+incubation[t]+noS[t]+cured[t])
            -(incubationN[t-14]||0)
        );
        incubationN.push(
            healthy[t]*meet*rate*(incubation[t]+noS[t])/(healthy[t]+incubation[t]+noS[t]+cured[t])
        );
        healthy.push(
            healthy[t]-healthy[t]*meet*rate*(incubation[t]+noS[t])/(healthy[t]+incubation[t]+noS[t]+cured[t])
        );


        sick.push(
            sick[t]
            +(incubationN[t-14]||0)*symptomRate
            -(sickN[t-30]||0)
        );
        sickN.push(
            (incubationN[t-14]||0)*symptomRate
        );

        noS.push(
            noS[t]
            +(incubationN[t-14]||0)*(1-symptomRate)
            -(noSN[t-30]||0)
        );
        noSN.push(
            (incubationN[t-14]||0)*(1-symptomRate)
        );

        cured.push(
            cured[t]
            +(sickN[t-30]||0)*(1-mortalityRate)
            +(noSN[t-30]||0)
        );

        dead.push(
            dead[t]
            +(sickN[t-30]||0)*mortalityRate
        );
    }

    var chart = new Chart();
    chart.setWidth(1000);
    chart.setHeight(500);
    document.body.appendChild(chart.canvas);


    var xmax = 200;//simdays;
    var ymax = 10000000/10;
    chart.setRange(0,0,xmax,ymax);


    chart.drawChart(cured,0,simdays,"#0f0");
    chart.setRange(0,0,xmax,ymax/100);
    chart.drawChart(sickN,0,simdays,"#f0f");
    chart.setRange(0,0,xmax,ymax);
    chart.drawChart(incubation,0,simdays,"#00f");
    chart.drawChart(sick,0,simdays,"#f00");
    chart.drawChart(dead,0,simdays,"#000");
    console.log(healthy,cured,sick,dead);
}

calcVals();
