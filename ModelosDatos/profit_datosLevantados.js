const mongoose=require('mongoose');
const {Schema}=mongoose;

const datosLevantadosProfitSchema=new Schema({
	identificador:{type:String,required:true},
    fechaInserccion:{type:Date,default:Date.now},
    tipoEncuesta:{type:String,required:true},
    datalevantada:{type:String,required:true}
});

module.exports=mongoose.model('datosLevantados_profitDirecto',datosLevantadosProfitSchema);