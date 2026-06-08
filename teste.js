// Carrega as variáveis de ambiente do arquivo .env.
// Isso permite usar dados como host, porta, usuário, senha e nome do banco
// sem escrever essas informações diretamente no código.
require('dotenv').config();

// Importa o framework Express.
// O Express será usado para criar a API e suas rotas.
const express = require('express');

// Importa a biblioteca mysql2.
// Essa biblioteca permite conectar o Node.js ao banco de dados MySQL.
const mysql = require('mysql2');

// Cria uma aplicação Express.
// A variável app representa o servidor da nossa API.
const app = express();

// Configura a API para aceitar dados no formato JSON.
// Isso é importante quando o frontend envia informações para o backend.
app.use(express.json());

// Cria a conexão com o banco de dados MySQL.
// Os dados de conexão estão vindo das variáveis de ambiente.
const conexao = mysql.createConnection({

  // Endereço do servidor MySQL hospedado no Aiven.
  host: process.env.DB_HOST,

  // Porta usada para acessar o banco MySQL.
  port: Number(process.env.DB_PORT),

  // Usuário do banco de dados.
  user: process.env.DB_USER,

  // Senha do usuário do banco de dados.
  password: process.env.DB_PASSWORD,

  // Nome do banco de dados que será acessado.
  database: process.env.DB_NAME,

  // Configuração SSL para conexão segura com banco em nuvem.
  ssl: {
    rejectUnauthorized: false
  }
});

// Cria uma rota GET para a página inicial da API.
// Quando alguém acessar a URL principal do Render,
// essa mensagem será exibida.
app.get('/', (req, res) => {

  // Envia uma resposta em texto para o navegador ou cliente HTTP.
  res.send('API do sistema de alunos e notas rodando no Render!');
});

// Cria uma rota GET chamada /teste-banco.
// Essa rota será usada para testar se a API consegue acessar o banco MySQL.
app.get('/teste-banco', (req, res) => {

  // Executa uma consulta SQL simples no banco.
  // SELECT NOW() retorna a data e hora atual do servidor MySQL.
  conexao.query('SELECT NOW() AS data_hora_atual', (erro, resultados, campos) => {

    // Verifica se ocorreu algum erro durante a consulta ao banco.
    if (erro) {

      // Retorna uma resposta HTTP com status 500,
      // indicando erro interno no servidor.
      return res.status(500).json({

        // Indica que a requisição falhou.
        status: 'erro',

        // Mensagem amigável para informar o problema.
        mensagem: 'Erro ao conectar ao banco MySQL do Aiven',

        // Mostra a mensagem técnica do erro.
        erro: erro.message,

        // Mostra o código do erro, quando existir.
        codigo: erro.code,

        // Mostra o número do erro, quando existir.
        errno: erro.errno,

        // Mostra o estado SQL, quando existir.
        sqlState: erro.sqlState
      });
    }

    // Se não houve erro, retorna uma resposta em formato JSON.
    res.json({

      // Indica que a requisição deu certo.
      status: 'sucesso',

      // Mensagem de sucesso.
      mensagem: 'Conexão com o banco MySQL do Aiven realizada com sucesso!',

      // Retorna a data e hora vinda do banco de dados.
      // resultados[0] acessa a primeira linha retornada pela consulta.
      data_hora_atual: resultados[0].data_hora_atual,

      // Retorna a quantidade de registros encontrados.
      total_registros: resultados.length,

      // Retorna todos os resultados vindos do banco.
      resultados: resultados,

      // Retorna informações sobre os campos da consulta.
      campos: campos.map(campo => ({
        nome: campo.name,
        tabela: campo.table,
        tipo: campo.type,
        tamanho: campo.length
      })),

      // Retorna algumas informações da conexão.
      // A senha não deve ser retornada por segurança.
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

// Define a porta onde o servidor irá rodar.
// No Render, a plataforma fornece automaticamente a variável process.env.PORT.
// Localmente, caso essa variável não exista, será usada a porta 3000.
const PORT = process.env.PORT || 3000;

// Inicia o servidor Express.
// A API começa a ficar disponível para receber requisições.
app.listen(PORT, () => {

  // Exibe no terminal uma mensagem informando em qual porta o servidor está rodando.
  console.log(`Servidor rodando na porta ${PORT}`);
});