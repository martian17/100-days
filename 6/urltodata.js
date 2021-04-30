var urlToData = function(url,callback){
    var img = document.createElement("img");
    img.setAttribute("crossOrigin", "anonymous");
    img.addEventListener("load"
    ,function(){
        var canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(this,0,0);
        var data = ctx.getImageData(0,0,this.width,this.height);
        callback(data);
    },false);
    img.src = url;
};
