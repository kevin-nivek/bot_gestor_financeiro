import bcrypt from 'bcrypt';
import userService from '../services/user.service.js';

async function createUser(req, res, next) {
  try {
    let user =  req.body;
    const email_verify = await userService.getUserByEmail(user.email)
    if (!email_verify && user.password == user.confirmPassword){
      user.password = await bcrypt.hash(user.password, 10)
      res.send(await userService.createUser(user))
    }
    else{
      let erros = []
      if(email_verify){
        erros.push("Email ja cadastrado")
      
      }
      if (user.password != user.confirmPassword){
        erros.push("Senhas e confirmação de senha diferentes")
      }
      res.send(erros.join(' e '))
      
    }
    

  } catch (error) {
    throw error 
  }
}

async function getUserByEmail(req, res){
  try {
    let {email, password} =   req.body;
    const user = await userService.getUserByEmail(email)
    if (user){
      const senhaCorreta = await bcrypt.compare(password, user.password)
      if (senhaCorreta){
        req.session.user = user;
        res.send("Logado com sucesso")
        return
      }
    }
  } catch (error) {
    throw error
  }
}


async function destroySession(req,res){
  req.session.destroy();
}

export default{
  createUser,
  getUserByEmail,
  destroySession
}
