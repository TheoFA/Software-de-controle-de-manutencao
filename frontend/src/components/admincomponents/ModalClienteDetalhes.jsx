import { useEffect, useState } from 'react';
import axios from 'axios';

export function ModalClienteDetalhes({ cliente, produtos, onClose }) {
  const [manutencoes, setManutencoes] = useState([]);

  useEffect(() => {
    carregarManutencoes();
  }, []);

  const carregarManutencoes = async () => {
    try {
      const res = await axios.get('http://localhost:3000/manutencoes');
      setManutencoes(res.data || []);
    } catch (err) {
      console.error('Erro ao carregar manutenções:', err);
    }
  };

  const produtosDoCliente = produtos.filter(p => p.clienteId === cliente.id);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Detalhes do Cliente</h2>
        <p><strong>Nome:</strong> {cliente.nome}</p>
        <p><strong>Empresa:</strong> {cliente.empresa}</p>
        <p><strong>Contato:</strong> {cliente.contato}</p>

        <h3 style={{ marginTop: '1rem' }}>Produtos</h3>
        {produtosDoCliente.length === 0 ? (
          <p>Nenhum produto encontrado para este cliente.</p>
        ) : (
          <ul style={{ paddingLeft: '1rem' }}>
            {produtosDoCliente.map(prod => {
              const historico = manutencoes.filter(m => m.produtoId === prod.id);
              return (
                <li key={prod.id} style={{ marginBottom: '1rem' }}>
                  <strong>{prod.codigoPublico}</strong> - Série: {prod.numeroSerie}
                  <br />Aquis.: {prod.dataAquisicao}
                  <br />Manutenções:
                  <ul>
                    {historico.length === 0 ? (
                      <li>Nenhuma manutenção registrada.</li>
                    ) : (
                      historico.map(m => (
                        <li key={m.id}>{m.data} — {m.descricao} ({m.status})</li>
                      ))
                    )}
                  </ul>
                </li>
              );
            })}
          </ul>
        )}

        <button onClick={onClose} style={{ marginTop: '1rem' }}>Fechar</button>
      </div>
    </div>
  );
}
