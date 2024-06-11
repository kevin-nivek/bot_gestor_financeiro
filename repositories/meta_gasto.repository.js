import { Op } from "sequelize"
import MetaGasto from "../models/meta_gasto.model.js"

async function createMetaGasto(metaGasto) {
  try {
    return await MetaGasto.create(metaGasto)
  } catch (error) {
    throw error
  }
  
}


async function getAllMetaGasto(userId='5894861031'){
  try {
    const busca = MetaGasto.findAll({
      where: {
        userId: {
          [Op.or]: [null,userId],
        },
      }
    })
    return busca
  } catch (error) {
    throw error;
  }
}


async function getAllMetaGastoMonthYear(userId = '5894861031',monthYear){
  const y = parseInt(monthYear.split('-')[1]);
  const m =parseInt( monthYear.split('-')[0]);
  const firstDay = new Date(y, m, 1);
  const lastDay = new Date(y, m + 1, 1);
  try {
    const busca = MetaGasto.findOne({
      where: {
        userId: {
          [Op.or]: [null,userId],
        },
        date: {
          [Op.between]: [firstDay, lastDay]
        }
      }
    })
    return busca
  } catch (error) {
    throw error;
  }
}
async function getMetaGasto(id){
  try{
    return await MetaGasto.findByPk(id)
    // .findOne({
    //   where:{
    //     tipoGastoId: id,
    //     userId:{
    //       [Op.or]: [null,userId],
    //     }
    //   }
    // })
  } catch (error) {
    throw error;
  }
}

async function updateMetaGasto(metaGasto) {
  try {
    await MetaGasto.update(
      { 
        value: metaGasto.value,
        date: metaGasto.date,
        over: metaGasto.over,
        userId: metaGasto.userId
      },
      {
        where: {
          metaGastoId: metaGasto.metaGastoId
        }
      }
    )
    return await getMetaGasto(metaGasto.metaGastoId)
  } catch (error) {
    
  }
}

async function deleteMetaGasto(id){
  try {
    await MetaGasto.destroy({
      where: {
        metaGastoId: id
      }
    })
  } catch (error) {
    throw error
  }
}

export default {
  createMetaGasto,
  getAllMetaGasto,
  getAllMetaGastoMonthYear,
  getMetaGasto,
  updateMetaGasto,
  deleteMetaGasto

}