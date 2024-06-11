import userRepository from '../repositories/user.repository.js';

async function createUser(user){
  return await userRepository.createUser(user)
}

async function getUserByEmail(email){
  return await userRepository.getUserByEmail(email)
}

export default{
  createUser,
  getUserByEmail
}