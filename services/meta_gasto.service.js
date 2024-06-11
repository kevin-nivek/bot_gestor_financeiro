
import MetaGastoRepository from "../repositories/meta_gasto.repository.js";


async function   createMetaGasto(metaGasto){
  return await MetaGastoRepository.createMetaGasto(metaGasto)
}

async function getAllMetaGasto(userId){
  return await MetaGastoRepository.getAllMetaGasto(userId)
}

async function getAllMetaGastoMonthYear(userId, monthYear){
  return await MetaGastoRepository.getAllMetaGastoMonthYear(userId, monthYear)
}

async function getMetaGasto(id){
  return await MetaGastoRepository.getMetaGasto(id)
}

async function updateMetaGasto(metaGasto){
  return await MetaGastoRepository.updateMetaGasto(metaGasto)
}

async function deleteMetaGasto(id){
  return await MetaGastoRepository.deleteMetaGasto(id)
}

export default {
  createMetaGasto,
  getAllMetaGasto,
  getAllMetaGastoMonthYear,
  getMetaGasto,
  updateMetaGasto,
  deleteMetaGasto
}