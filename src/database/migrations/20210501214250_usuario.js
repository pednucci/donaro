const dotenv = require('dotenv');
dotenv.config();

exports.up = function(knex) {
  return knex.schema.createTable('usuario', (table) => {
    table.increments('cd_usuario').primary().notNullable();
    table.string('nm_usuario', 45).notNullable();
    table.string('cd_cpf_usuario', 11).notNullable();
    table.string('cd_celular_usuario', 11).notNullable();
    table.string('sg_estado_usuario', 2).notNullable();
    table.string('nm_cidade_usuario', 255).notNullable();
    table.string('cd_senha_usuario', 45).notNullable();
    table.string('cd_email_usuario', 75).notNullable();
    table.boolean('cd_isAdmin_usuario').defaultTo(false).notNullable();
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('usuario');
};
