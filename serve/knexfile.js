const { db } = require('./.env')

// module.exports = {
//     client: 'postgresql',
//     connection: db,
//     pool: {
//       min: 2,
//       max: 10
//     },
//     migrations: {
//       tableName: 'knex_migrations'
//     }
// }
module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './config/dbteste.sqlite'
    },
    migrations:{
      directory: './config/migrations'
    },
    useNullAsDefault: true
  }
}