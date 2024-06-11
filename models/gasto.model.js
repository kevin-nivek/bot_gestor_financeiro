import { INTEGER, Sequelize } from "sequelize";
import db from '../utils/db.js';
import User from "./user.model.js";
import TipoGasto from "./tipo_gasto.model.js";

const Gasto = db.define('gastos',{
  gastoId: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },

  value:{
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  date: {
    type: Sequelize.DATE,
    allowNull: false,
  },

}, {underscored: true})

Gasto.belongsTo(User, {foreignKey: "userId"});
Gasto.belongsTo(TipoGasto, {foreignKey: "tipoGastoId"});

export default Gasto