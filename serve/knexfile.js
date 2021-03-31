module.exports = {

  development: {
    client: 'sqlite',
    connection: {
      filename: 'config/db.sqlite'
    },
    migrations:{
      directory: 'migrations'
    },
    useNullAsDefault: true
  }
}