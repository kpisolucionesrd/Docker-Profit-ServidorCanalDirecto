const mongoose=require('mongoose');
const {Schema}=mongoose;

const supermercadosMercaderistaProfitSchema=new Schema({
	identificador:{type:String,required:true},
	fechaInserccion:{type:Date,default:Date.now},
	supermercados:[String]
});

module.exports=mongoose.model('supermercadosMercaderistaTeam_profitDirecto',supermercadosMercaderistaProfitSchema);