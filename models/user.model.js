import { Sequelize } from "sequelize";
import db from '../utils/db.js';


const User = db.define('users',{
  userId: {
    type: Sequelize.STRING,

    // type: Sequelize.INTEGER,
    // autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  phone: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  chat:{
    type: Sequelize.STRING,
    allowNull: true
  },
  pin:{
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  }
}, {underscored: true})

export default User