import TipoGastoService from "../services/tipo_gasto.service.js";

async function createTipoGasto(req, res,next){
  try {
    let tipoGasto = req.body;
    if(!tipoGasto.name){
      throw new Error('Nome não pode ser vazio')
    }
    tipoGasto.desativado = false;
    res.send(await TipoGastoService.createTipoGasto(tipoGasto))
  } catch (err) {
    next(err)
  }
}

async function getAllTipoGastos(req, res, next) {
  console.log("GET ALL ");
  try {
    let{ userId }= req.body
    res.send(await TipoGastoService.getAllTipoGastos(userId))
  } catch (err) {
    next(err)
  }
  
}

async function getTipoGasto(req, res, next){
  try{
    res.send(await TipoGastoService.getTipoGasto(req.params.id))
  } catch(err){
    next(err)
  }
}

async function updateTipoGasto(req, res, next){
  try{
    let tipoGasto = req.body;
    let userId = req.params.userId
    if(!tipoGasto.name){
      throw new Error('Nome não pode ser vazio')
    }
    res.send(await TipoGastoService.updateTipoGasto(tipoGasto,userId))
  }
  catch(erro){
    next (erro)
  }
}

export default{
  createTipoGasto,
  getAllTipoGastos,
  getTipoGasto,
  updateTipoGasto
}