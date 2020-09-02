const config = require('../knexfile')

const knex = require('knex')(config)

// executar as migrates caso haja alterações
knex.migrate.latest([config])

module.exports = knex