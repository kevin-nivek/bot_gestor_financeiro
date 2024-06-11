import MetaGastoService from "../services/meta_gasto.service.js";

async function createMetaGasto(req, res,next){
  try {
    let metaGasto = req.body;
    if(!metaGasto.value){
      throw new Error('Valor não pode ser vazio')
    }
    metaGasto.desativado = false;
    res.send(await MetaGastoService.createMetaGasto(metaGasto))
  } catch (err) {
    next(err)
  }
}

async function getAllMetaGasto(req, res, next) {
  try {
    let{ userId }= req.body
    let monthYear = req.query.monthYear
    console.log(req.query);
    console.log(monthYear);
    if(monthYear){
      res.send(await MetaGastoService.getAllMetaGastoMonthYear(userId,monthYear))
    }
    else{
      res.send(await MetaGastoService.getAllMetaGasto(userId))
    }
  } catch (err) {
    next(err)
  }
  
}

async function getMetaGasto(req, res, next){
  try{
    res.send(await MetaGastoService.getMetaGasto(req.params.id))
  } catch(err){
    next(err)
  }
}

async function updateMetaGasto(req, res, next){
  try{
    let metaGasto = req.body;
    if(!metaGasto.value){
      throw new Error('Valor não pode ser vazio')
    }
    res.send(await MetaGastoService.updateMetaGasto(metaGasto))
  }
  catch(erro){
    next (erro)
  }
}

async function deleteMetaGasto(req, res, next){
  try{
    res.send(await MetaGastoService.deleteMetaGasto(req.params.id))
  } catch(err){
    next(err)
  }
}

export default {
  createMetaGasto,
  getAllMetaGasto,
  getMetaGasto,
  updateMetaGasto,
  deleteMetaGasto
}