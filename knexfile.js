const dotenv = require('dotenv');
dotenv.config();

module.exports = {

  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASS
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./src/database/migrations"
    }
  }
};


