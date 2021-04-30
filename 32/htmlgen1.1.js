//make the attribute parser


var ADDELEMFUNC = function(nname,inner,attr,style){
    if(nname.add === ADDELEMFUNC){//it's an object
        this.e.appendChild(nname.e);
        return nname;
    }else{//it's a string or element, which will be taken care of by ELEM
        var eelem = new ELEM(nname,inner,attr,style);
        this.e.appendChild(eelem.e);
        return eelem;
    }
};

var ADDATTRFUNC = function(a,b){
    this.e.setAttribute(a,b);
};


var ELEM = function(nname,inner,attr,style){
    if(typeof nname === "string"){
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
        this.e = e;
    }else{//nname is an element
        this.e = nname;
    }
    this.add = ADDELEMFUNC;
    this.attr = ADDATTRFUNC;
};

var body = (new function(){
    this.e = document.body;
    this.add = ADDELEMFUNC;
    this.attr = ADDATTRFUNC;
}());
