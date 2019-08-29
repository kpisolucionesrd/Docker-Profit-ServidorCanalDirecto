const express=require('express');
const app=express();
const morgan=require('morgan');
const multer=require('multer');
const {mongoose}=require('./ConexionDB_CanalDirecto.js');

//MODELOS Canal Indirecto
const UsuariosMercaderistas=require('./ModelosDatos/profit_users.js');
const ReiniciosUsuarios=require('./ModelosDatos/profit_reiniciosUsuarios.js');
const SupermercadosAsignados=require('./ModelosDatos/profit_supermercadosFlashteam.js');
const CamposCompletados=require('./ModelosDatos/profit_camposCompletados.js');
const SupermercadosAsignadosMercaderista=require('./ModelosDatos/profit_supermercadosMercaderista.js');
const DatosLevantados=require('./ModelosDatos/profit_datosLevantados.js');

//Canal Indirecto Imagenes
var storage=multer.diskStorage({
	destination:function(req,file,cb){
		cb(null,'../imagenesdirecto/');
	},
	filename:function(req,file,cb){
		cb(null,new Date().toISOString()+file.originalname)
	}
});
const upload=multer({storage:storage,limits:{fileSize:1024*1024*100}});

//Middlewares
app.use(express.json());
app.use(morgan('combined'));
app.use(express.static('Sistemas'));
app.use(express.urlencoded());

//PROFIT CANAL INDIRECTO
//---------------------------------------------------------------------
/*gettesr*/
app.get('/api/canaldirecto/profit_usuarios/:identificador',async (req,res)=>{
	/*Esta función se utiliza para conseguir el usuario{mercaderista} y sus datos.
	Esto para lograr realizar el loggin a la aplicación mobile*/
	const mercaderista=req.params.identificador;
	const usuario=await UsuariosMercaderistas.find({identificador:mercaderista});
	console.log(usuario);
	res.json(usuario);
});

app.get('/api/canaldirecto/profit_supermercadosflashteam/:identificador',async(req,res)=>{
    const mercaderista=req.params.identificador;
    const ObjetoSupermercados=await SupermercadosAsignados.find({identificador:mercaderista});
    console.log(ObjetoSupermercados);
    res.json(ObjetoSupermercados);

});

app.get('/api/canaldirecto/profit_supermercadosmercaderista/:identificador',async(req,res)=>{
    const mercaderista=req.params.identificador;
    const ObjetoSupermercados=await SupermercadosAsignadosMercaderista.find({identificador:mercaderista});
    console.log(ObjetoSupermercados);
    res.json(ObjetoSupermercados);
})

app.get('/api/canaldirecto/profit_supermercadosCompletados/:identificador/:tipousuario/:tipoEncuesta',async(req,res)=>{
    let identificador=req.params.identificador;
    let tipoEncuesta=req.params.tipoEncuesta;
    let tipousuario=req.params.tipousuario;
    let dato=await CamposCompletados.find({identificador:identificador,tipousuario:tipousuario,tipoEncuesta:tipoEncuesta});
    console.log(dato);
    res.json(dato);
});


/*setter*/
app.post('/api/canaldirecto/profit_insertar_usuarios',async (req,res)=>{
	/*Esta función se utiliza para insertar usuarios en la aplicacion*/
	const { 
		identificador,
        nombre,
        apellido,
        password,
        perfil,
        zona,
		supervisor,
        es_supervisor}=req.body
	try
	{
		await UsuariosMercaderistas.deleteMany({identificador:identificador},function(err){
			if(err) return handleError(err);
		});
	}
	catch(e)
	{
		console.log(e)
	}

	const datos=new UsuariosMercaderistas(
    {identificador,
        nombre,
        apellido,
        password,
        perfil,
        zona,
        supervisor,
        es_supervisor});

	console.log(datos);
	await datos.save();
	res.json('recibido');
});

app.post('/api/canaldirecto/profit_insertar_supermercados_flashteam',async(req,res)=>{
    const {identificador,supermercados}=req.body;    
        
    //Eliminando documento previos
    await SupermercadosAsignados.deleteMany({identificador:identificador},function(err){console.log(err)});


    let dato=new SupermercadosAsignados({identificador,supermercados});
    await dato.save();
    console.log(dato);
    res.json('Supermercados ingresados');
});

app.post('/api/canaldirecto/profit_insertar_supermercados_mercaderista',async(req,res)=>{
    const {identificador,supermercados}=req.body;    
        
    //Eliminando documento previos
    await SupermercadosAsignadosMercaderista.deleteMany({identificador:identificador},function(err){console.log(err)});

    //Cargando los supermercados
    let dato=new SupermercadosAsignadosMercaderista({identificador,supermercados});
    await dato.save();
    console.log(dato);
    res.json('Supermercados Mercaderista ingresados');
});

app.post('/api/canaldirecto/registroreinicios',async(req,res)=>{
    const{password}=req.body;
    const datos=new ReiniciosUsuarios({password});
    await datos.save();
    res.json('recibido');
});

app.post('/api/canaldirecto/profit_supermercadosCompletados',async(req,res)=>{
    let {identificador,tipousuario,supermercadoscompletados,tipoEncuesta}=req.body;
    var dato=await CamposCompletados.find({identificador:identificador,tipousuario:tipousuario,tipoEncuesta:tipoEncuesta});

    //Verificacion si el usuario tiene campos completados
    if(dato.length>0){
        //Posee campos completados UPDATE
        console.log(dato);
        let vectorNuevo=await dato[0].supermercadoscompletados.concat(supermercadoscompletados);
        const updateRes=await CamposCompletados.updateOne({identificador:identificador,tipousuario:tipousuario,tipoEncuesta:tipoEncuesta},{supermercadoscompletados:vectorNuevo});
        res.json('Usuario actualizado');

    }else{
        //No Posee campos completados CREATE
        let datoUsuario=new CamposCompletados({identificador,tipousuario,supermercadoscompletados,tipoEncuesta});
        await datoUsuario.save();
        res.json('Usuario no tenia campos completados');
        console.log(datoUsuario);
    }
});

app.post('/api/canaldirecto/insertarimagenes',upload.single('foto_colmados'),async(req,res)=>{
	console.log(req.file);
	res.json('imagen Recibida');
});

app.post('/api/canaldirecto/profit_insertar_data',async(req,res)=>{
    const {identificador,tipoEncuesta,datalevantada}=req.body;
    const datos=new DatosLevantados({identificador,tipoEncuesta,datalevantada});
    await datos.save();
    res.json('recibido');
    console.log(datos);
});


//GENERALES
//---------------------------------------------------------------------
app.get('*',(req,res)=>{
	res.end('Esta ruta no existe. Favor verificar la url');
});

//Servidor
app.listen(80,function(){console.log('Servidor funcionando...')});