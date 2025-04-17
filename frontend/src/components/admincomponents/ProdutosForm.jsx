import { useState, useEffect } from 'react';
import axios from 'axios';
import { ModalHistoricoProduto } from './ModalHistoricoProduto';

export function ProdutosForm({ produtos, setProdutos, clientes, tipos }) {
  const [clienteId, setClienteId] = useState('');
  const [tipoProdutoId, setTipoProdutoId] = useState('');
  const [numeroSerie, setNumeroSerie] = useState('');
  const [dataAquisicao, setDataAquisicao] = useState('');
  const [busca, setBusca] = useState('');
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  useEffect(() => {
    carregarProdutos();
  }, []);

  async function carregarProdutos() {
    try {
      const res = await axios.get('http://localhost:3000/produtos');
      setProdutos(res.data);
    } catch (err) {
      console.error('Erro ao carregar produtos:', err);
    }
  }
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const cliente = parseInt(clienteId);
    const tipo = parseInt(tipoProdutoId);
  
    if (isNaN(cliente) || isNaN(tipo)) {
      alert('Selecione um cliente e um tipo de produto válidos.');
      return;
    }
  
    try {
      const res = await axios.post('http://localhost:3000/produtos', {
        clienteId: cliente,
        tipoProdutoId: tipo,
        numeroSerie,
        dataAquisicao
      });
  
      setProdutos([...produtos, res.data]);
      setClienteId('');
      setTipoProdutoId('');
      setNumeroSerie('');
      setDataAquisicao('');
    } catch (err) {
      console.error('Erro ao cadastrar produto:', err.message);
      alert('Erro ao cadastrar produto');
    }
  };
  

  const produtosFiltrados = produtos.filter(p => {
    const cliente = clientes.find(c => c.id == p.clienteId);
    const tipo = tipos.find(t => t.id == p.tipoProdutoId);
    return (
      (cliente?.nome || '').toLowerCase().includes(busca.toLowerCase()) ||
      (tipo?.nome || '').toLowerCase().includes(busca.toLowerCase())
    );
  });

  const abrirHistorico = (produto) => {
    setProdutoSelecionado(produto);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Cadastrar Produto</h2>
        <select value={clienteId} onChange={e => setClienteId(e.target.value)} required>
          <option value="">Cliente</option>
          {clientes.map(c => (
            <option key={c.id} value={c.id}>
              {c.nome} (ID: {c.id})
            </option>
          ))}
        </select>

        <select value={tipoProdutoId} onChange={e => setTipoProdutoId(e.target.value)} required>
          <option value="">Tipo de Produto</option>
          {tipos.map(t => (
            <option key={t.id} value={t.id}>
              {t.nome} (ID: {t.id})
            </option>
          ))}
        </select>

        <input
          value={numeroSerie}
          onChange={e => setNumeroSerie(e.target.value)}
          placeholder="Número de Série"
          required
        />
        <input
          type="date"
          value={dataAquisicao}
          onChange={e => setDataAquisicao(e.target.value)}
          required
        />
        <button type="submit">Salvar</button>
      </form>

      <input
        type="text"
        value={busca}
        onChange={e => setBusca(e.target.value)}
        placeholder="Buscar por cliente ou tipo..."
        style={{ marginTop: '1rem', padding: '0.5rem', width: '100%' }}
      />

      <table style={{ marginTop: '1rem', width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f3f4f6' }}>
            <th style={{ textAlign: 'left', padding: '8px' }}>Código</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Tipo</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Cliente</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Série</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Aquis.</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtosFiltrados.map(p => {
            const cliente = clientes.find(c => c.id == p.clienteId);
            const tipo = tipos.find(t => t.id == p.tipoProdutoId);
            return (
              <tr key={p.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '8px' }}>{p.codigoPublico}</td>
                <td style={{ padding: '8px' }}>{tipo?.nome}</td>
                <td style={{ padding: '8px' }}>{cliente?.nome}</td>
                <td style={{ padding: '8px' }}>{p.numeroSerie}</td>
                <td style={{ padding: '8px' }}>{p.dataAquisicao}</td>
                <td style={{ padding: '8px' }}>
                  <button onClick={() => abrirHistorico(p)}>Ver Histórico</button>
                </td>
              </tr>
            );
          })}
          {produtosFiltrados.length === 0 && (
            <tr>
              <td colSpan="6" style={{ padding: '8px', textAlign: 'center' }}>
                Nenhum produto encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {produtoSelecionado && (
        <ModalHistoricoProduto
          produto={produtoSelecionado}
          onClose={() => setProdutoSelecionado(null)}
        />
      )}
    </div>
  );
}
