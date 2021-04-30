var Elem = function(nname,inner,attr,style){
    var e = document.createElement(nname);
    if(inner)e.innerHTML = inner;
    if(attr){
        var attrs = attr.split(";").map((at)=>{
            at = at.split(":");
            if(at.length !== 2)return false;
            e.setAttribute(at[0],at[1]);
        });
    }
    if(style)e.style = style;
    return e;
};
