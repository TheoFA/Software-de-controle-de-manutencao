import { useState } from 'react';
import axios from 'axios';
import { ModalDetalhesManutencao } from './ModalDetalhesManutencao';

export function ManutencaoAprovacao({ manutencoes, setManutencoes, produtos }) {
  const [busca, setBusca] = useState('');
  const [manutencaoSelecionada, setManutencaoSelecionada] = useState(null);

  const carregarManutencoes = async () => {
    try {
      const res = await axios.get('http://localhost:3000/manutencoes');
      setManutencoes(res.data);
    } catch (err) {
      console.error('Erro ao atualizar manutenções:', err);
    }
  };

  const filtradas = manutencoes.filter(m => {
    const produto = produtos.find(p => p.id == m.produtoId);
    return (
      m.status === 'pendente' &&
      (
        m.descricao.toLowerCase().includes(busca.toLowerCase()) ||
        (produto?.codigoPublico || '').toLowerCase().includes(busca.toLowerCase())
      )
    );
  });

  return (
    <div>
      <h2>Aprovar Manutenções</h2>

      <input
        type="text"
        value={busca}
        onChange={e => setBusca(e.target.value)}
        placeholder="Buscar por código ou descrição..."
        style={{ marginBottom: '1rem', padding: '0.5rem', width: '100%' }}
      />

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
                    backgroundColor: '#facc15',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>Pendente</span>
                </td>
                <td style={{ padding: '8px' }}>
                  <button onClick={() => setManutencaoSelecionada(m)}>Ver Detalhes</button>
                </td>
              </tr>
            );
          })}
          {filtradas.length === 0 && (
            <tr>
              <td colSpan="5" style={{ padding: '8px', textAlign: 'center' }}>Nenhuma manutenção pendente.</td>
            </tr>
          )}
        </tbody>
      </table>

      {manutencaoSelecionada && (
        <ModalDetalhesManutencao
          manutencao={manutencaoSelecionada}
          produto={produtos.find(p => p.id === manutencaoSelecionada.produtoId)}
          onClose={() => setManutencaoSelecionada(null)}
          onAtualizar={carregarManutencoes}
        />
      )}
    </div>
  );
}
