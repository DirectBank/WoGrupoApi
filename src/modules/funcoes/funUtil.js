const TYPES = require('tedious').TYPES;

function validaId(id){
    return (id!==undefined||Number(id)>0 || !isNaN(id))
}


function convertTipo(tipoVariavel){
    if(tipoVariavel == "varchar"){
        return TYPES.VarChar;
    }
    else if(tipoVariavel == "int"){
        return TYPES.Int;
    }
    else if(tipoVariavel == "tinyint"){
        return TYPES.TinyInt;
    }
    else {
        return "" ;
    }

}



module.exports={validaId,convertTipo}