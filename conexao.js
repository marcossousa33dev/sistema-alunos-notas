// Carrega as variáveis do arquivo .env
require('dotenv').config();

// Importa a biblioteca mysql2
const mysql = require('mysql2');

// Cria a conexão com o banco MySQL do Aiven
const conexao = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  // Configuração SSL necessária para conexão com banco em nuvem
  ssl: {
    rejectUnauthorized: false
  }
});

// Exporta a conexão para ser usada em outros arquivos
module.exports = conexao;