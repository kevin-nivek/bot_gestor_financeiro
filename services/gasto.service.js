import GastoRepository from "../repositories/gasto.repository.js";


async function createGasto(gasto){
  return await GastoRepository.createGasto(gasto)
}

async function getAllGastos(){
  return await GastoRepository.getAllGastos()
}

async function getGasto(id){
  return await GastoRepository.getGasto(id)
}

async function updateGasto(gasto){
  return await GastoRepository.updateGasto(gasto)
}

async function deleteGasto(id){
  return await GastoRepository.deleteGasto(id)
}

async function getGastoMonthOfYear(monthYear,tipo){

  return await GastoRepository.getGastoMonthOfYear(monthYear,tipo)
}

export default{
  createGasto,
  getAllGastos,
  getGasto,
  updateGasto,
  deleteGasto,
  getGastoMonthOfYear
}