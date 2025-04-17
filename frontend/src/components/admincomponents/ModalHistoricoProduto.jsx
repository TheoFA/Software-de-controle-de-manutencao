import { useEffect, useState } from 'react';
import axios from 'axios';

export function ModalHistoricoProduto({ produto, onClose }) {
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

  const historico = manutencoes.filter(m => m.produtoId === produto.id);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Histórico do Produto</h2>
        <p><strong>Código:</strong> {produto.codigoPublico}</p>
        <p><strong>Série:</strong> {produto.numeroSerie}</p>
        <p><strong>Aquisição:</strong> {produto.dataAquisicao}</p>

        <h3 style={{ marginTop: '1rem' }}>Manutenções</h3>
        {historico.length === 0 ? (
          <p>Nenhuma manutenção registrada.</p>
        ) : (
          <ul>
            {historico.map(m => (
              <li key={m.id}><strong>{m.data}</strong> — {m.descricao} ({m.status})</li>
            ))}
          </ul>
        )}

        <button onClick={onClose} style={{ marginTop: '1rem' }}>Fechar</button>
      </div>
    </div>
  );
}
