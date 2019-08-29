const mongoose=require('mongoose');
const {Schema}=mongoose;

const reiniciosProfitSchema=new Schema({
	password:{type:String,required:true},
	fechaInserccion:{type:Date,default:Date.now}

});

module.exports=mongoose.model('reinicios_profitDirecto',reiniciosProfitSchema);