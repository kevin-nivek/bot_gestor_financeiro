import gastoService from "../services/gasto.service.js";
import GastoService from "../services/gasto.service.js";

async function createGasto(req, res,next){
  try {
    let gasto = req.body;
    if(!gasto.value ){
      throw new Error('Valor não pode ser vazio')
    }
    if(!gasto.date){
      let today = new Date()
      console.log(today);
      gasto.date = today
    }
    res.send(await GastoService.createGasto(gasto))
  } catch (err) {
    next(err)
  }
}

async function getAllGastos(req, res, next) {
  console.log("GET ALL ");
  try {
    res.send(await GastoService.getAllGastos())
  } catch (err) {
    next(err)
  }
  
}

async function getGasto(req, res, next){
  try{
    res.send(await GastoService.getGasto(req.params.id))
  } catch(err){
    next(err)
  }
}

async function updateGasto(req, res, next){
  try{
    let gasto = req.body;
    if(!gasto.value || !gasto.date ){
      throw new Error(' Data e Valor não pode ser vazio')
    }

    res.send(await GastoService.updateGasto(gasto))
  }
  catch(erro){
    next (erro)
  }
}
async function deleteGasto(req, res, next){
  try{
    res.send(await GastoService.deleteGasto(req.params.id))
  } catch(err){
    next(err)
  }
}

async function getGastoMonthOfYear(req, res,next) {
  try {
    res.send(await gastoService.getGastoMonthOfYear(req.params.monthYear, req.query.tipoGastoId))
  } catch (err) {
    next (err)
  }
}
export default{
  createGasto,
  getAllGastos,
  getGasto,
  updateGasto,
  deleteGasto,
  getGastoMonthOfYear
}