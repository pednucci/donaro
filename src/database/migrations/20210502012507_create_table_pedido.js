const dotenv = require('dotenv');
dotenv.config();

exports.up = function(knex) {
  return knex.schema.createTable('pedido', table => {
      table.increments('cd_pedido').primary().notNullable();
      table.integer('cd_usuario_pedido').unsigned();
      table.foreign('cd_usuario_pedido').references('cd_usuario').inTable('usuario').onDelete('SET NULL');
      table.string('nm_titulo_pedido', 45).notNullable();
      table.string('nm_alimento_pedido', 45).notNullable();
      table.string('nm_meta_pedido', 15).notNullable();
      table.timestamp('dt_encerramento_pedido').notNullable();
      table.timestamp('dt_createdAt_pedido').defaultTo(knex.fn.now());
      table.timestamp('dt_acceptedAt_pedido').defaultTo(null);
      table.string('nm_cidade_usuario', 32).notNullable();
      table.string('sg_estado_usuario', 2).notNullable();
      table.text('ds_acao_pedido').notNullable();
      table.string('cd_imagem_pedido', 255).defaultTo('/imgs/default.jpg').notNullable();
      table.boolean('cd_avaliacao_admin_pedido').defaultTo(false).notNullable();
      table.boolean('cd_expirado_pedido').defaultTo(false).notNullable();
      table.integer('qt_doacoes_pedido').notNullable();
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('pedido');
};
