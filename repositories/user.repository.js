import { where } from "sequelize";
import User from "../models/user.model.js";

async function createUser(user) {
  try {
    return await User.create(user)
  } catch (error) {
    throw error
  }
  
}

async function getUserByEmail(email){
  try{
    return User.findOne({
      where: {email}
    })
  }catch(error){
    throw error
  }
}






export default{
  createUser,
  getUserByEmail
}