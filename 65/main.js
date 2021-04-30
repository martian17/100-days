

body.add("h1","opposing current force calculator");
var div1 = body.add("div");
var div2 = body.add("div");
var div3 = body.add("div");
var button = body.add("input",false,"type:button;value:calculate;");
var div4 = body.add("div");

div1.add("span","distance:   ");
var distE = div1.add("input",false,"type:text;value:6371e3").e;

div2.add("span","current:    ");
var currentE = div2.add("input",false,"type:text;value:4e6").e;

div3.add("span","permeability:   ");
var permeabilityE = div3.add("input",false,"type:text;value:4*Math.PI*1e-7").e;

button.e.addEventListener("click",
function(){
    var dist = eval(distE.value);
    var current = eval(currentE.value);
    var permeability = eval(permeabilityE.value);
    div4.e.innerHTML = (permeability*current*current/2/Math.PI/dist)+"N"
});
