import { useEffect, useState } from 'react';
import axios from 'axios';
import { ModalDetalhesManutencao } from "./ModalDetalhesManutencao";


function PesquisarManutencoes() {
  const [manutencoes, setManutencoes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [buscaProduto, setBuscaProduto] = useState('');
  const [buscaResponsavel, setBuscaResponsavel] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [selecionada, setSelecionada] = useState(null);

  useEffect(() => {
    async function carregarDados() {
      const [manRes, prodRes] = await Promise.all([
        axios.get('http://localhost:3000/manutencoes'),
        axios.get('http://localhost:3000/produtos')
      ]);
      setManutencoes(manRes.data);
      setProdutos(prodRes.data);
    }
    carregarDados();
  }, []);

  const filtradas = manutencoes.filter(m => {
    const produto = produtos.find(p => p.id === m.produtoId);
    const produtoMatch = buscaProduto ? produto?.codigoPublico.toLowerCase().includes(buscaProduto.toLowerCase()) : true;
    const responsavelMatch = buscaResponsavel ? m.responsavel?.toLowerCase().includes(buscaResponsavel.toLowerCase()) : true;
    const dataMatch =
      (!dataInicio || m.data >= dataInicio) &&
      (!dataFim || m.data <= dataFim);
    return produtoMatch && responsavelMatch && dataMatch;
  });

  return (
    <div>
      <h2>Pesquisar Manutenções</h2>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Código do Produto"
          value={buscaProduto}
          onChange={e => setBuscaProduto(e.target.value)}
          style={{ flex: 1, padding: '0.5rem' }}
        />
        <input
          type="text"
          placeholder="Responsável"
          value={buscaResponsavel}
          onChange={e => setBuscaResponsavel(e.target.value)}
          style={{ flex: 1, padding: '0.5rem' }}
        />
        <input type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} />
        <input type="date" value={dataFim} onChange={e => setDataFim(e.target.value)} />
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f3f4f6' }}>
            <th style={{ textAlign: 'left', padding: '8px' }}>Data</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Produto</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Responsável</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Status</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filtradas.map(m => {
            const produto = produtos.find(p => p.id === m.produtoId);
            return (
              <tr key={m.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '8px' }}>{m.data}</td>
                <td style={{ padding: '8px' }}>{produto?.codigoPublico}</td>
                <td style={{ padding: '8px' }}>{m.responsavel}</td>
                <td style={{ padding: '8px' }}>{m.status}</td>
                <td style={{ padding: '8px' }}>
                  <button onClick={() => setSelecionada(m)}>Ver Detalhes</button>
                </td>
              </tr>
            );
          })}
          {filtradas.length === 0 && (
            <tr>
              <td colSpan="5" style={{ padding: '8px', textAlign: 'center' }}>Nenhuma manutenção encontrada.</td>
            </tr>
          )}
        </tbody>
      </table>

      {selecionada && (
        <ModalDetalhesManutencao
          manutencao={selecionada}
          produto={produtos.find(p => p.id === selecionada.produtoId)}
          onClose={() => setSelecionada(null)}
          onAtualizar={() => {}} // opcional aqui
        />
      )}
    </div>
  );
}

export default PesquisarManutencoes;
