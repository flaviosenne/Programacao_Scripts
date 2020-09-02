// Update with your config settings.

module.exports = {
  
    client: 'postgresql',
    connection: {
      database: '',
      user: 'joao',
      password: 'joao',
    },

    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }