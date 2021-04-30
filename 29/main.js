var inverse = function(matrix){
    var colAvailability = [];
    for(var i = 0; i < matrix[0].length; i++){
        colAvailability[i] = {};
    }
    for(var i = 0; i < matrix.length;){
        var row = matrix[i];
        for(var j = 0; j < row.length; j++){
            if(row[j] !== 0){
                colAvailability[j][i] = true;
            }
        }
    }
    for(var i = 0; i < matrix[0].length; i++){
        if(colAvailability[i].length === 0){
            return false;
        }
    }
    
    var sequence = [];
    var toSequence = {};
    //depth first search
    var searchSequence = function(n){
        colAvailability[n]
    }
    searchSequence(0);
    
}