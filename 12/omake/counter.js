
var first = true;
var counter = 0;
var start = 0;

document.addEventListener("keydown",
function(e){
    if(e.keyCode === 65){
        if(first){
            start = performance.now();

            first = false;
        }else{
            var now = performance.now();
            var ms = (start-now)/(counter+1);
            console.log(ms,counter);
            counter++;
        }
    }else if(e.keyCode === 83){
        var now = performance.now();
        var ms = (start-now)/(counter+1);
        console.log(ms);
    }
});



var init = function(){
    first = true;
    counter = 0;
    start = 0;
};
