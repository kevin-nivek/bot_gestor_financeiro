import { INTEGER, Sequelize } from "sequelize";
import db from '../utils/db.js';
import User from "./user.model.js";

const TipoGasto = db.define('tipo_gastos',{
  tipoGastoId: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  desativado:{
    type: Sequelize.BOOLEAN
  }

}, {underscored: true})

TipoGasto.belongsTo(User, {foreignKey: "userId"});
export default TipoGasto