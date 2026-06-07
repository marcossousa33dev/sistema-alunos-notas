// Importa a conexão criada no arquivo conexao.js
const conexao = require('./conexao');

// Tenta conectar ao banco de dados
conexao.connect((erro) => {
  if (erro) {
    console.log('Erro ao conectar ao banco MySQL do Aiven:');
    console.log(erro.message);
    return;
  }

  console.log('Conexão realizada com sucesso!');
  console.log('Conectado ao banco MySQL do Aiven.');

  // Executa uma consulta simples apenas para testar o banco
  conexao.query('SELECT NOW() AS data_hora_atual', (erro, resultados) => {
    if (erro) {
      console.log('Erro ao executar consulta:');
      console.log(erro.message);
      conexao.end();
      return;
    }

    console.log('Consulta executada com sucesso!');
    console.log('Data e hora retornada pelo banco:');
    console.log(resultados[0].data_hora_atual);

    // Fecha a conexão com o banco
    conexao.end();
  });
});
