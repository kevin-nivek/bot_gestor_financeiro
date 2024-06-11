# Bot do Telegram para gestão financiera

Antes de mais nada é necessario definir algumas coisas 
 * Banco de dados: em utils crie um arquivo db.js semelhante a esse
``` js
  import Sequelize from "sequelize";
  
  const sequelize = new Sequelize(
    "postgres:",
    {
      dialect: "postgres",
      define: {
        timestamps: false
      },
  
    }
  
  )
  
  export default sequelize;
```
* Token do seu bot: primeiro gere o token no BotFather do telegram e em seguida crie um arquivo .env na raiz do projeto cole o trecho abaixo e subtitua onde esta escrito token pelo token gerado BotFather

```
bot_token ="token"
```
