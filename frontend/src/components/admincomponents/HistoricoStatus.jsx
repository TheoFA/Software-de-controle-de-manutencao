import { useState, useEffect } from 'react';
import axios from 'axios';
import { ModalDetalhesManutencao } from './ModalDetalhesManutencao';

export function HistoricoStatus({ manutencoes, setManutencoes, produtos, status, cor, rotulo }) {
  const [busca, setBusca] = useState('');
  const [clientes, setClientes] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [selecionada, setSelecionada] = useState(null);

  useEffect(() => {
    carregarClientes();
    carregarManutencoes();
  }, []);

  async function carregarClientes() {
    try {
      const res = await axios.get('http://localhost:3000/clientes');
      setClientes(res.data || []);
    } catch (err) {
      console.error('Erro ao carregar clientes:', err);
    }
  }

  async function carregarManutencoes() {
    try {
      const res = await axios.get('http://localhost:3000/manutencoes');
      setManutencoes(res.data);
    } catch (err) {
      console.error('Erro ao carregar manutenções:', err);
    }
  }

  const filtradas = manutencoes
    .filter(m => m.status === status)
    .filter(m => {
      const produto = produtos.find(p => p.id == m.produtoId);
      const cliente = produto ? clientes.find(c => c.id == produto.clienteId) : null;

      const descricaoMatch = m.descricao.toLowerCase().includes(busca.toLowerCase());
      const codigoMatch = (produto?.codigoPublico || '').toLowerCase().includes(busca.toLowerCase());

      const clienteMatch = clienteSelecionado
        ? cliente?.id == clienteSelecionado
        : true;

      const dataValida =
        (!dataInicio || m.data >= dataInicio) &&
        (!dataFim || m.data <= dataFim);

      return (descricaoMatch || codigoMatch) && clienteMatch && dataValida;
    });

  return (
    <div>
      <h2>Manutenções com status: {rotulo}</h2>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <input
          type="text"
          value={busca}
          onChange={e => setBusca(e.target.value)}
          placeholder="Buscar por código ou descrição..."
          style={{ flex: 1, padding: '0.5rem' }}
        />
        <select
          value={clienteSelecionado}
          onChange={e => setClienteSelecionado(e.target.value)}
        >
          <option value="">Todos os clientes</option>
          {clientes.map(c => (
            <option key={c.id} value={c.id}>{c.nome}</option>
          ))}
        </select>
        <input
          type="date"
          value={dataInicio}
          onChange={e => setDataInicio(e.target.value)}
        />
        <input
          type="date"
          value={dataFim}
          onChange={e => setDataFim(e.target.value)}
        />
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f3f4f6' }}>
            <th style={{ textAlign: 'left', padding: '8px' }}>Data</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Produto</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Descrição</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Status</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filtradas.map(m => {
            const produto = produtos.find(p => p.id == m.produtoId);
            return (
              <tr key={m.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '8px' }}>{m.data}</td>
                <td style={{ padding: '8px' }}>{produto?.codigoPublico}</td>
                <td style={{ padding: '8px' }}>{m.descricao}</td>
                <td style={{ padding: '8px' }}>
                  <span style={{
                    backgroundColor: cor,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    color: 'white'
                  }}>{rotulo}</span>
                </td>
                <td style={{ padding: '8px' }}>
                  <button onClick={() => setSelecionada(m)}>Ver Detalhes</button>
                </td>
              </tr>
            );
          })}
          {filtradas.length === 0 && (
            <tr>
              <td colSpan="5" style={{ padding: '8px', textAlign: 'center' }}>
                Nenhuma manutenção com este status.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {selecionada && (
        <ModalDetalhesManutencao
          manutencao={selecionada}
          produto={produtos.find(p => p.id === selecionada.produtoId)}
          onClose={() => setSelecionada(null)}
          onAtualizar={carregarManutencoes}
        />
      )}
    </div>
  );
}
