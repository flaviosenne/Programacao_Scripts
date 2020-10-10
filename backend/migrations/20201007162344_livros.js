
exports.up = function(knex, Promise) {
    return knex.schema.createTable('livros', table => {
        table.increments('id').primary()
        table.string('name').notNull()
        table.string('description').notNull()
        table.string('imageUrl').notNull()
        table.binary('content').notNull()
        table.integer('userId').references('id').inTable('users').notNull()
        table.integer('generosId').references('id').inTable('generos').notNull()
    })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('livros')
};
