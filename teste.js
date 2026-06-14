// Carrega as variáveis de ambiente do arquivo .env.
require('dotenv').config();

// Importa o framework Express.
const express = require('express');

// Importa a biblioteca mysql2.
const mysql = require('mysql2');

// Importa o CORS para permitir acesso do frontend.
const cors = require('cors');

// Cria uma aplicação Express.
const app = express();

// Libera o acesso à API por outros domínios, como o Netlify.
app.use(cors());

// Configura a API para aceitar dados no formato JSON.
app.use(express.json());

// Cria a conexão com o banco de dados MySQL.
const conexao = mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  }
});

// Rota principal da API.
app.get('/', (req, res) => {
  res.send('API do sistema de alunos e notas rodando no Render!');
});

// Rota para testar conexão com o banco.
app.get('/teste-banco', (req, res) => {
  conexao.query('SELECT NOW() AS data_hora_atual', (erro, resultados, campos) => {
    if (erro) {
      return res.status(500).json({
        status: 'erro',
        mensagem: 'Erro ao conectar ao banco MySQL do Aiven',
        erro: erro.message,
        codigo: erro.code,
        errno: erro.errno,
        sqlState: erro.sqlState
      });
    }

    res.json({
      status: 'sucesso',
      mensagem: 'Conexão com o banco MySQL do Aiven realizada com sucesso!',
      data_hora_atual: resultados[0].data_hora_atual,
      total_registros: resultados.length,
      resultados: resultados,
      campos: campos.map(campo => ({
        nome: campo.name,
        tabela: campo.table,
        tipo: campo.type,
        tamanho: campo.length
      })),
      conexao: {
        host: process.env.DB_HOST,
        porta: Number(process.env.DB_PORT),
        usuario: process.env.DB_USER,
        banco: process.env.DB_NAME,
        ssl: true
      }
    });
  });
});

// Define a porta do servidor.
const PORT = process.env.PORT || 3000;

// Inicia o servidor.
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});