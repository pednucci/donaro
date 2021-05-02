
exports.up = function(knex) {
  return knex.schema.createTable('solicitacao', table => {
    table.increments('cd_solicitacao').primary().notNullable();
    table.integer('cd_pedido_solicitacao').unsigned();
    table.foreign('cd_pedido_solicitacao').references('cd_pedido').inTable('pedido');
    table.text('ds_comentario_solicitacao');
    table.boolean('cd_aceito_solicitacao').defaultTo(false);
    table.string('cd_situacao_solicitacao', 45).defaultTo('A CONFIRMAR');
    table.integer('cd_usuario_solicitacao').unsigned();
    table.foreign('cd_usuario_solicitacao').references('cd_usuario').inTable('usuario');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('solicitacao')
};
