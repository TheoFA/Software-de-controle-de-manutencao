// /frontend/src/pages/ClientePage.jsx
import { useState } from 'react';
import axios from 'axios';

function ClientePage() {
  const [codigo, setCodigo] = useState('');
  const [produto, setProduto] = useState(null);
  const [manutencoes, setManutencoes] = useState([]);
  const [erro, setErro] = useState('');

  const buscarProduto = async () => {
    try {
      // 1. Busca todos os produtos
      const produtosRes = await axios.get('http://localhost:3000/produtos');
      const produtos = produtosRes.data;
  
      // 2. Filtra pelo código
      const encontrado = produtos.find(p => p.codigoPublico === codigo.trim().toUpperCase());
  
      if (!encontrado) {
        setErro('Produto não encontrado.');
        setProduto(null);
        setManutencoes([]);
        return;
      }
  
      // 3. Busca manutenções filtradas pelo produto
      const manutencoesRes = await axios.get('http://localhost:3000/manutencoes');
      const doProduto = manutencoesRes.data.filter(
        m => String(m.produtoId) === String(encontrado.id) && m.status === 'aprovado'
      );
  
      setProduto(encontrado);
      setManutencoes(doProduto);
      setErro('');
    } catch (err) {
      console.error(err);
      setErro('Erro ao buscar produto.');
    }
  };
  

  return (
    <div>
      <h1>Consulta de Manutenções</h1>
      <form onSubmit={e => { e.preventDefault(); buscarProduto(); }}>
        <input
          value={codigo}
          onChange={e => setCodigo(e.target.value)}
          placeholder="Digite o código do produto"
          required
        />
        <button type="submit">Buscar</button>
      </form>

      {erro && <p style={{ color: 'red' }}>{erro}</p>}

      {produto && (
        <div>
          <h2>Produto: {produto.codigoPublico}</h2>
          <p>Nº de Série: {produto.numeroSerie}</p>
          <p>Data de aquisição: {produto.dataAquisicao}</p>

          <h3>Manutenções aprovadas:</h3>
          <ul>
            {manutencoes.map(m => (
              <li key={m.id}><strong>{m.data}</strong>: {m.descricao}</li>
            ))}
            {manutencoes.length === 0 && <p>Nenhuma manutenção aprovada.</p>}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ClientePage;