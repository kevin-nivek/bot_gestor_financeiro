import { where ,Op} from "sequelize";
import Gasto from "../models/gasto.model.js";

async function createGasto(gasto) {
  try {
    console.log(gasto)
    return await Gasto.create(gasto)
  } catch (error) {
    // console.log(error)
    throw error
  }
  
}

async function getAllGastos(userId ='5894861031'){
  try {
    let gastos= await Gasto.findAll({
      where:{
        userId: 
        {
          [Op.or]: [null,userId],
        },
      }
      
    })
    let gastos_totais = 0
    gastos.forEach(gasto => {
      gastos_totais+= gasto.value
    });
    return {gastos, gastos_totais}
  } catch (error) {
    
  }
}

async function getGasto(id){
  try{
    return await Gasto.findByPk(id)
  }catch (error){
    throw error;
  }
}

async function getGastoMonthOfYear(monthYear,tipo,userId ='5894861031'){
  const y = monthYear.split('-')[1];
  const m = monthYear.split('-')[0];
  const firstDay = new Date(y, m, 1);
  const lastDay = new Date(parseInt(monthYear.split('-')[1]), parseInt(monthYear.split('-')[0]) + 1, 1);
  // const userId =0
  let gastos 
  let gastos_totais =0
  try {
    if(tipo){
      gastos = await Gasto.findAll({
        where:{
          date: {
            [Op.between]: [firstDay, lastDay]
          },
          userId:  userId,
          
          tipoGastoId: tipo 
        }
      })
    }else{
      gastos = await Gasto.findAll({
        where:{
          date: {
            [Op.between]: [firstDay, lastDay]
          },
          userId: 
            userId
          
        }
      })
    }

    gastos.forEach(gasto => {
      gastos_totais += gasto.value
    });
    console.log(gastos_totais);
    console.log(gastos);
    return {gastos,gastos_totais}
  } catch (error) {
    
  }
}

async function updateGasto(gasto) {
  try {
    await Gasto.update(
      { 
        date: gasto.date,
        value: gasto.value,
        userId: gasto.userId,
        tipoGastoId: gasto.tipoGastoId
      },
      {
        where: {
          gastoId: gasto.gastoId
        }
      }
    )
    return await getGasto(gasto.gastoId)
  } catch (error) {
    
  }
}

async function deleteGasto(id){
  try {
    await Gasto.destroy({
      where: {
        gastoId: id
      }
    })
  } catch (error) {
    throw error
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