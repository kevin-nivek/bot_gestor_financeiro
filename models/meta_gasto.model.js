import { INTEGER, Sequelize } from "sequelize";
import db from '../utils/db.js';
import User from "./user.model.js";

const MetaGasto = db.define('meta_gastos',{
  metaGastoId: {
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
  over: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },

}, {underscored: true})


MetaGasto.belongsTo(User, {foreignKey: "userId"});
export default MetaGasto