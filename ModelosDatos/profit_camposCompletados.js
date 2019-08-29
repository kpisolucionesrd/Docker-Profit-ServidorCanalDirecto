const mongoose=require('mongoose');
const {Schema}=mongoose;

const camposCompletadosProfitSchema=new Schema({
	identificador:{type:String,required:true},
    tipousuario:{type:String,required:true},
    supermercadoscompletados:{type:Array,required:true},
    tipoEncuesta:{type:String,required:true}
});

module.exports=mongoose.model('camposCompletados_profitDirecto',camposCompletadosProfitSchema);