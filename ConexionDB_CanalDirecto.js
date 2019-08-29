const mongoose=require('mongoose');

//const URI='mongodb://localhost:27017/CanalDirecto';
const URI='mongodb://dbprofit1:27017/CanalDirecto';

mongoose.connect(URI,{ useNewUrlParser: true })
	.then(db=>console.log('DB CanalDirecto esta funcionando'))
	.catch(err=>console.error(err))

module.exports=mongoose;