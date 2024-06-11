import { where ,Op} from "sequelize";
import TipoGasto from "../models/tipo_gasto.model.js";


async function createTipoGasto(tipoGasto) {
  try {
    return await TipoGasto.create(tipoGasto)
  } catch (error) {
    throw error
  }
  
}

async function getAllTipoGastos(userId='0'){
  try{
    const busca = TipoGasto.findAll({
      where: {
        userId: {
          [Op.or]: [null,userId],
        },
      }
    })
    return busca
  }catch(error){
    throw error
  }
}

async function getTipoGasto(id,userId = '0'){
  try{
    return await TipoGasto.findOne({
      where:{
        tipoGastoId: id,
        userId:{
          [Op.or]: [null,userId],
        }
      }
    })
  }catch (error){
    throw error;
  }
}

async function getTipoGastoByName(name,userId = '0'){
  try{
    return await TipoGasto.findOne({
      where:{
        name,
        userId:{
          [Op.or]: [null,userId],
        }
      }
    })
  }catch (error){
    throw error;
  }
}

async function updateTipoGasto(tipoGasto,userId) {
  try {
    console.log("-------------------------------------------------------------");
    console.log(tipoGasto);
    console.log("-------------------------------------------------------------");

    const tpGst= await getTipoGasto(tipoGasto.tipoGastoId,userId)
    console.log(tpGst);
    if(tpGst.userId == userId || tpGst.userId == null){
      console.log(await TipoGasto.update(
        {
          name: tipoGasto.name,
          userId: tipoGasto.userId,
          desativado: tipoGasto.desativado
        },
        {
          where: {
            tipoGastoId: tipoGasto.tipoGastoId,
          }
        }
      ))
      return await getTipoGasto(tipoGasto.tipoGastoId)
    }
    else{
      throw new Error("UserId invalido")
    }
  } catch (error) {
    
  }
}
export default{
  createTipoGasto,
  getAllTipoGastos,
  getTipoGasto,
  updateTipoGasto,
  getTipoGastoByName
}