import TipoGastoRepository from "../repositories/tipo_gasto.repository.js";


async function   createTipoGasto(tipoGasto){
  return await TipoGastoRepository.createTipoGasto(tipoGasto)
}

async function getAllTipoGastos(userId){
  return await TipoGastoRepository.getAllTipoGastos(userId)
}

async function getTipoGasto(id){
  return await TipoGastoRepository.getTipoGasto(id)
}

async function updateTipoGasto(tipoGasto){
  return await TipoGastoRepository.updateTipoGasto(tipoGasto)
}

export default{
  createTipoGasto,
  getAllTipoGastos,
  getTipoGasto,
  updateTipoGasto
}