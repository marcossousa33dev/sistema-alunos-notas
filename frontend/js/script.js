/*
  URL base da sua API.

  Se estiver usando o Render, troque pela URL do seu backend.
  Exemplo:
  https://sistema-alunos-notas.onrender.com
*/
const API_URL = 'https://sistema-alunos-notas.onrender.com';

async function testarApi() {
  const resultadoApi = document.getElementById('resultado-api');
  const jsonCompleto = document.getElementById('json-completo');

  resultadoApi.className = 'status info';
  resultadoApi.innerText = 'Carregando dados da API...';

  try {
    const resposta = await fetch(`${API_URL}/`);

    if (!resposta.ok) {
      throw new Error(`Erro HTTP: ${resposta.status}`);
    }

    const texto = await resposta.text();

    resultadoApi.className = 'status sucesso';
    resultadoApi.innerText = texto;

    jsonCompleto.innerText = texto;

  } catch (erro) {
    resultadoApi.className = 'status erro';
    resultadoApi.innerText = 'Erro ao acessar a API. Verifique se o backend está rodando.';

    jsonCompleto.innerText = erro.message;
  }
}

async function testarBanco() {
  const resultadoBanco = document.getElementById('resultado-banco');
  const dadosBanco = document.getElementById('dados-banco');
  const jsonCompleto = document.getElementById('json-completo');

  resultadoBanco.className = 'status info';
  resultadoBanco.innerText = 'Consultando banco de dados...';

  dadosBanco.innerHTML = 'Carregando...';

  try {
    const resposta = await fetch(`${API_URL}/teste-banco`);

    if (!resposta.ok) {
      throw new Error(`Erro HTTP: ${resposta.status}`);
    }

    const dados = await resposta.json();

    jsonCompleto.innerText = JSON.stringify(dados, null, 2);

    if (dados.status === 'sucesso') {
      resultadoBanco.className = 'status sucesso';
      resultadoBanco.innerText = dados.mensagem;

      dadosBanco.innerHTML = `
        <p><strong>Status:</strong> ${dados.status}</p>
        <p><strong>Mensagem:</strong> ${dados.mensagem}</p>
        <p><strong>Data e hora atual do banco:</strong> ${dados.data_hora_atual}</p>
        <p><strong>Total de registros:</strong> ${dados.total_registros}</p>

        <h3>Informações da conexão</h3>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Host</td>
              <td>${dados.conexao.host}</td>
            </tr>
            <tr>
              <td>Porta</td>
              <td>${dados.conexao.porta}</td>
            </tr>
            <tr>
              <td>Usuário</td>
              <td>${dados.conexao.usuario}</td>
            </tr>
            <tr>
              <td>Banco</td>
              <td>${dados.conexao.banco}</td>
            </tr>
            <tr>
              <td>SSL</td>
              <td>${dados.conexao.ssl ? 'Ativado' : 'Desativado'}</td>
            </tr>
          </tbody>
        </table>

        <h3>Campos retornados pela consulta</h3>
        ${montarTabelaCampos(dados.campos)}

        <h3>Resultados da consulta</h3>
        ${montarTabelaResultados(dados.resultados)}
      `;

    } else {
      resultadoBanco.className = 'status erro';
      resultadoBanco.innerText = dados.mensagem || 'Erro ao consultar o banco.';

      dadosBanco.innerHTML = `
        <p><strong>Status:</strong> ${dados.status}</p>
        <p><strong>Mensagem:</strong> ${dados.mensagem}</p>
        <p><strong>Erro:</strong> ${dados.erro}</p>
        <p><strong>Código:</strong> ${dados.codigo}</p>
      `;
    }

  } catch (erro) {
    resultadoBanco.className = 'status erro';
    resultadoBanco.innerText = 'Erro ao acessar a rota /teste-banco.';

    dadosBanco.innerHTML = `
      <p>Não foi possível buscar os dados do backend.</p>
      <p><strong>Erro:</strong> ${erro.message}</p>
    `;

    jsonCompleto.innerText = erro.message;
  }
}

function montarTabelaCampos(campos) {
  if (!campos || campos.length === 0) {
    return '<p>Nenhum campo retornado.</p>';
  }

  let tabela = `
    <div class="tabela-container">
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Tabela</th>
            <th>Tipo</th>
            <th>Tamanho</th>
          </tr>
        </thead>
        <tbody>
  `;

  campos.forEach(campo => {
    tabela += `
      <tr>
        <td>${campo.nome}</td>
        <td>${campo.tabela || '-'}</td>
        <td>${campo.tipo}</td>
        <td>${campo.tamanho}</td>
      </tr>
    `;
  });

  tabela += `
        </tbody>
      </table>
    </div>
  `;

  return tabela;
}

function montarTabelaResultados(resultados) {
  if (!resultados || resultados.length === 0) {
    return '<p>Nenhum resultado retornado.</p>';
  }

  const colunas = Object.keys(resultados[0]);

  let tabela = `
    <div class="tabela-container">
      <table>
        <thead>
          <tr>
  `;

  colunas.forEach(coluna => {
    tabela += `<th>${coluna}</th>`;
  });

  tabela += `
          </tr>
        </thead>
        <tbody>
  `;

  resultados.forEach(linha => {
    tabela += `<tr>`;

    colunas.forEach(coluna => {
      tabela += `<td>${linha[coluna]}</td>`;
    });

    tabela += `</tr>`;
  });

  tabela += `
        </tbody>
      </table>
    </div>
  `;

  return tabela;
}