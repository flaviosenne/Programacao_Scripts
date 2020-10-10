
exports.up = function(knex, Promise) {
    return knex.schema.createTable('generos', table => {
        table.increments('id').primary()
        table.string('name').notNull()
       
        table.integer('relacaoId').references('id').inTable('generos')
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('generos')
};
