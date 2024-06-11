import { Markup, Telegraf,Scenes } from "telegraf";
import 'dotenv/config'

const bot = new Telegraf(process.env.BOT_TOKEN)
const Scene = Scenes.BaseScene; 
const setupScene = new Scene('setup');
const ethScene = new Scene('eth');
const stage = new Scenes.Stage([ethScene, setupScene]);
bot.use(stage.middleware());
bot.start((ctx) => ctx.reply('Olá sou o bot para ajudar no contrele de gastos.\n mande "ajuda" que te mostro o que posso fazer'))
bot.help((ctx) => ctx.reply('Mande mensagem eu mando o link do grupo \n Ou mande uma imagem e eu mando o texto dela'))
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
bot.on("callback_query", async (ctx)=> {
  const operation = ctx.callbackQuery.data;
  const userId = `${ctx.chat.id}`
  const msg = await defineAction(operation, userId)
  console.log(msg);
  ctx.reply(msg)
  //ctx.reply("👌")

})
bot.launch()
