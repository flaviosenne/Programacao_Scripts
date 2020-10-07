const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://script:script@script.n8ir1.mongodb.net/script?retryWrites=true&w=majority', 
    { useNewUrlParser: true, useUnifiedTopology: true } )

    mongoose.Promise = global.Promise
    mongoose.connection.on('connected', () => 
      console.log('Mongoose! conectado')
   )

   mongoose.connection.on('disconnected', () => 
      console.log('\x1b[41%s\x1b[37m', 'Mongoose! desconectado', '\x1b[0m')
   )

   mongoose.connection.on('error', erro => 
      console.log(`Mongoose! ERRO na conexão `)
   )

   // Capturamos um sinal de encerramento (SIGINT), Ctrl+C
   process.on('SIGINT', () => 
      mongoose.connection.close(() => {
         console.log('* Mongoose! Desconectado pelo término da aplicação');
         // 0 indica que a finalização ocorreu sem erros 
         process.exit(0);
      })
   )

   module.exports = mongoose