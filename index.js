import axios from "axios";
import express from 'express';
import session from "express-session";
import {message} from 'telegraf/filters'
import userRouter from './routes/user.route.js'
import tipoGastoRouter from './routes/tipo_gasto.route.js'
import gastoRouter from './routes/gasto.route.js'
import metaGastoRouter from './routes/meta_gasto.route.js'
import { Markup, Telegraf,Scenes } from "telegraf";


import 'dotenv/config'

// 
import sequelize from "./utils/db.js";
import meta_gastoRepository from "./repositories/meta_gasto.repository.js";
import gastoRepository from "./repositories/gasto.repository.js";
import tipo_gastoRepository from "./repositories/tipo_gasto.repository.js";
sequelize.sync()
// Index ->  Router -> controler -> service ->repository -> model

const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN)
//-------------------- SERVER --------------------------------------------------------
app.use(express.json())
app.use(session({
  secret: 'kuronivek',
  resave: false,
  saveUninitialized: false
}))

app.use(express.urlencoded({extended: false}));


app.use('/user', userRouter)

app.use('/tipo_gasto',tipoGastoRouter)

app.use('/gasto',gastoRouter)

app.use('/meta_gasto',metaGastoRouter)



app.get('/', (req, res)=>{
  if(req.session.user){
    res.send("Hello There ⚔️")
  }
  res.send("NOT ALLOWED")
})

//-------------------------------- BOT ----------------------------------

const Scene = Scenes.BaseScene; 
const setupScene = new Scene('setup');
const ethScene = new Scene('eth');
const stage = new Scenes.Stage([ethScene, setupScene]);
bot.use(stage.middleware());

let actions = null
function verificaValorIsNaN(valor){
  return !isNaN(parseFloat(valor)) && isFinite(valor)
}



async function createMetaByBot(value, userId){
  let dt = new Date() 
  const metaGasto = {
    value,
    date: dt,
    over: false,
    userId
  }
  let meta = await meta_gastoRepository.createMetaGasto(metaGasto)
  return meta
}

async function cadastros(message,userId){
  switch (actions) {
    case "tipo_gasto":
      message = message.toLocaleLowerCase();
      const tipoGasto = {
        name: message,
        userId
      }
      const resp = await tipo_gastoRepository.createTipoGasto(tipoGasto)
      console.log(resp );
      console.log(resp.tipoGastoId);
      if (resp.tipoGastoId){
        actions = null;
        return `${message} criado com sucesso 👍` 
      }
      else{
        return `Não consegui criar ${message} ☹️\n Tente novamente ` 
      }
      
      break;

    case "meta_gasto":
      const size_msg = message.length
      const msg_error_format = `Formato de Valor invalido utilize como o exemplo abaixo
      100.00` 
      let centavos = message.substring(size_msg, size_msg-3)
      let tempMesg = message.replaceAll('.','').replaceAll(',','')
      if (centavos.includes('.')||centavos.includes(',')){
        if (centavos.indexOf('.')!= -1 && centavos.indexOf('.') <2 ){
          centavos= centavos.split('.')[1]
        }
        else if (centavos.indexOf(',')!= -1 && centavos.indexOf(',') <2){
          centavos = centavos.split(',')[1]
        }
        else{
            centavos = ''
        }
        if (verificaValorIsNaN(tempMesg)){
          tempMesg = tempMesg.substring(0, size_msg-1 - (centavos.length))+"."+centavos
          const resp = await createMetaByBot(tempMesg,userId)          
          if (resp.metaGastoId){
            actions = null
            return ` Limite de ${resp.value} criado para esse mês`
          }
          else{
            return `Não consegui criar esse limite ☹️\n Tente novamente ` 
          }

        }else{
          return msg_error_format
        }

      }else{
        if(message.trim()[0] != '.' ||message.trim()[0] != ','){
          if(verificaValorIsNaN(tempMesg)){
            const resp = await createMetaByBot(tempMesg,userId)
            if (resp.metaGastoId){
              actions = null
              return ` Limite de ${resp.value} criado para esse mês`
            }
            else{
              return `Não consegui criar esse limite ☹️\n Tente novamente ` 
            }
          }else{
            return msg_error_format
          }
        } else{
          return msg_error_format
        }

      }
      break;
  }
}

bot.start((ctx) => ctx.reply('Olá sou o bot para ajudar no controle de gastos.\n mande "ajuda" que te mostro o que posso fazer'))
bot.help((ctx) => {
  let ops = Markup.inlineKeyboard([
    [Markup.button.callback('Cadastrar novo tipo de gasto', 'tipo_gasto')],
    [Markup.button.callback('Ver tipos de gasto', 'ver_tipo_gasto')],
    [Markup.button.callback('Cadastrar nova meta de gastos', 'meta_gasto')],
    [Markup.button.callback('Ver gastos do mes', 'gastos')],

  ])
  ctx.reply("Você pode salvar um gasto mandando uma mensagem com o tipo de gasto e o valor \n por exemplo : 'Mercado 100,00'\n Essas são as opções do que posso fazer \n ", ops)

})
bot.hears('hi', (ctx) => ctx.reply('Hello there'))
bot.hears(['ajuda', "Ajuda", "Ações", "ações"], async (ctx)=>{
  let ops = Markup.inlineKeyboard([
    [Markup.button.callback('Cadastrar novo tipo de gasto', 'tipo_gasto')],
    [Markup.button.callback('Ver tipos de gasto', 'ver_tipo_gasto')],
    [Markup.button.callback('Cadastrar nova meta de gastos', 'meta_gasto')],
    [Markup.button.callback('Ver gastos do mes', 'gastos')],

  ])
  ctx.reply("Você pode salvar um gasto mandando uma mensagem com o tipo de gasto e o valor \n por exemplo : 'Mercado 100,00'\n Essas são as opções do que posso fazer \n ", ops)
})

bot.hears(['Cadastrar novo tipo de gasto','Cadastrar nova meta de gastos','Ver gastos do mes', 'Ver tipos de gasto'], async (ctx)=>{
  const userId = `${ctx.chat.id}`
  const message = ctx.message.text
  const actionsCall = {'Cadastrar novo tipo de gasto': 'tipo_gasto',
  'Ver tipos de gasto': 'ver_tipo_gasto',
  'Cadastrar nova meta de gastos': 'meta_gasto',
  'Ver gastos do mes': 'gastos'}

  const msg = await defineAction(actionsCall[message], userId)
  ctx.reply(msg)
})

bot.on(message('text'), async ctx => {
  const userId = `${ctx.chat.id}`
  const message = ctx.message.text
  if(actions != null){
    let response = await cadastros(message,userId)
    ctx.reply(response)
  }

  let tempMesg = message.replaceAll('.','').replaceAll(',','').replaceAll('  ',' ')
  let isPos0 = verificaValorIsNaN(tempMesg.split(' ')[0])
  let isPos1 = verificaValorIsNaN(tempMesg.split(' ')[1])

  let tipoGastoNome = isPos0 ? message.split(' ')[1] : isPos1 ? message.split(' ')[0] : null
  let moneyMsg =  isPos0 ? message.split(' ')[0] : isPos1 ? message.split(' ')[1] : null
 
  const msg_error_format = `Verifique o se o tipo de gasto está correto e se o valor esta no formato certo como por exemplo: \n Mercado 123.45 ` 
  
  if(tipoGastoNome != null && moneyMsg != null){
  
    const size_msg = moneyMsg.length
    let centavos = moneyMsg.substring(size_msg, size_msg-3)
    let allMony= moneyMsg
    moneyMsg = moneyMsg.replaceAll('.','').replaceAll(',','')
    const tipoGasto = await tipo_gastoRepository.getTipoGastoByName(tipoGastoNome.toLowerCase(),userId)

    if (tipoGasto && centavos.includes('.')||centavos.includes(',') || (!moneyMsg.includes('.') && !moneyMsg.includes(',') )  ){
      if (centavos.indexOf('.')!= -1 && centavos.indexOf('.') <2 ){
        centavos= centavos.split('.')[1]
      }
      else if (centavos.indexOf(',')!= -1 && centavos.indexOf(',') <2){
        centavos = centavos.split(',')[1]
      }
      else{
        centavos = ''
      }

      tempMesg = allMony.substring(0, centavos != '' ?  size_msg  - (centavos.length+1) : size_msg) + (centavos != '' ? "."+centavos : '')
      const gasto = {
        value: parseFloat(tempMesg),
        tipoGastoId: tipoGasto.tipoGastoId,
        userId,
        date: new Date()
      } 
      const resp = await gastoRepository.createGasto(gasto)
        console.log(resp);
      if(resp.gastoId){
        ctx.reply("Gasto cadastrado com sucesso")
        ctx.reply(await defineAction('gastos',userId))
        return
      }
      else{
        ctx.reply( `Não consegui cadastrar esse gasto ☹️\n Tente novamente ` )
        return
      }
    }else{
      ctx.reply(msg_error_format)
      return 
    }     
  }
  
  
})
async function defineAction(operation,userId){
  let dt = new Date() 
  let data_atual = `${dt.getMonth()}-${dt.getFullYear()}`
  let meta=[]
  switch (operation) {
    case "tipo_gasto":
      actions = "tipo_gasto"
      return ("Qual o novo tipo de gasto?")
      break;
    
    case "ver_tipo_gasto":
      const tiposGasto = await tipo_gastoRepository.getAllTipoGastos(userId)
      return `Os tipos de gasto são:\n${tiposGasto.map(tipo => `• ${tipo.name}`).join(',\n')}`
      break;


    case "meta_gasto":
      //meta = await meta_gastoRepository.getAllMetaGastoMonthYear(userId,data_atual)
      console.log( meta)
      if (meta.length>0){
        actions = null
        return (`Esse mês ja possui uma meta de ${meta.value}`)
      }else{
        let dt = new Date() 
        let data_atual = `${dt.getMonth()}-${dt.getFullYear()}`
        actions = "meta_gasto"
        const atualMeta = await meta_gastoRepository.getAllMetaGastoMonthYear(userId, data_atual )
        if(atualMeta){
          return (`Ja existe meta cadastrada para esse mês no valor de ${atualMeta.value}`)
        }
        //verificar se ja nao exite um ameta nesse mes 
        return ("Qual o valor da meta de gasto?")
      }


      break;

    case "gastos":
      
      // limite 
      meta = await meta_gastoRepository.getAllMetaGastoMonthYear(userId,data_atual)

      // Gasto total 
      let gastos = await gastoRepository.getGastoMonthOfYear(data_atual,null, userId)

      const limite = meta ?  meta.value - gastos.gastos_totais : "meta não foi definida"
      return (`valor total gasto este mês é R$ ${(gastos.gastos_totais).toFixed(2)} e  
${ typeof(limite) == "string" ? limite : `a meta de gastos é R$${(meta.value).toFixed(2)}`}\n 
${ typeof(limite) != "string" ?` tendo  ${limite < 0 ? '-' : ''} R$${(limite).toFixed(2)} para atingir a meta ` :''}` )

      break;
  
    default:
      break;
  }

}

bot.on("callback_query", async (ctx)=> {
  const operation = ctx.callbackQuery.data;
  const userId = `${ctx.chat.id}`
  const msg = await defineAction(operation, userId)
  console.log(msg);
  ctx.reply(msg)
  //ctx.reply("👌")

})
// bot.action('new_limite', console.log("limite"))
bot.launch()


app.listen(3000, ()=> console.log("Api is listenen on port 3000"))

