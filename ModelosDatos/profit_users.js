const mongoose=require('mongoose');
const {Schema}=mongoose;

const usuariosProfitSchema=new Schema({
	identificador:{type:String,required:true},
	nombre:{type:String,required:true},
	apellido:{type:String,required:true},
	password:{type:String,required:true},
	perfil:{type:String,required:true},
	zona:{type:String,required:true},
	supervisor:{type:String,required:true},
	es_supervisor:{type:String,required:true}
});

module.exports=mongoose.model('usuarios_profit',usuariosProfitSchema);