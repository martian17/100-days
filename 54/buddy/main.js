var buffer = [];

var blen = 64;
for(var i = 0; i < blen ;i++){
    buffer[i] = 0;
}



var tree = [0];//0 free [] splitted
var allocTable = {};

var allocate = function(bytes,id){
    if(bytes < 1){
        return false;
    }


    var locloc = 64;

    var traverse = function(subtree,loc){
        locloc = loc;
        if(subtree[0] === 0){//found empty spot
            if(loc < bytes){
                return false;
            }
            if(loc/bytes < 2){//adequate
                //allocate
                subtree[0] = id;
                return [];
            }else{
                subtree[0] = [0];
                subtree[1] = [0];
                subtree = subtree[0];

                var result = traverse(subtree,loc/2)
                result.unshift(0);
                return result;
            }
        }else if(typeof subtree[0] === "number"){//got to the bottom
            //already allocated
            return false;
        }else{
            var result1 = traverse(subtree[0],loc/2);
            if(result1 !== false){
                result1.unshift(0);
                return result1;
            }
            var result2 = traverse(subtree[1],loc/2);
            if(result2 !== false){
                result2.unshift(1);
                return result2;
            }
            return false;
        }
        //returns address
    }

    var address = traverse(tree,64);
    if(address === false){
        console.log("memory ran out");
        return false;
    }
    allocTable[id] = address;
    return [translateAddress(address,64,0),address,locloc];
};


var free = function(id){
    var address = allocTable[id];
    var subtree = tree;
    var len = address.length;

    var stack = [];

    for(var i = 0; i < len; i++){
        stack.push(subtree);
        subtree = subtree[address[i]];
    }
    subtree[0] = 0;
    for(var i = len-1; i >= 0; i--){
        var addrcomp = address[i] === 0?1:0;
        if(stack[i][addrcomp][0] === 0){
            stack[i][0] = 0;
            stack[i].length = 1;//may not be necessary
        }else{
            break;
        }
    }

    delete allocTable[id]
}

var translateAddress = function(address,loc){
    var iaddr = 0;
    for(var i = 0; i < address.length; i++){
        loc /= 2;
        iaddr += address[i] === 0?0:loc;
    }
    return iaddr;
};


var nstring = function(n,s){
    var a = "";
    for(var i = 0; i < n; i++){
        a += s;
    }
    return a;
}

var display = function(tree,loc){
    if(tree[0] === 0){
        return nstring(loc,"0");
    }else if(typeof tree[0] === "number"){
        return nstring(loc,tree[0]);
    }else{
        return display(tree[0],loc/2)+display(tree[1],loc/2);
    }
};

console.log(display(tree,64));
allocate(5,1);
allocate(10,2);
allocate(1,3);
console.log(allocate(2,4));
console.log(display(tree,64));
free(3);
console.log(display(tree,64));
free(4);
console.log(display(tree,64));
free(2);
console.log(display(tree,64));
free(1);
console.log(display(tree,64));
