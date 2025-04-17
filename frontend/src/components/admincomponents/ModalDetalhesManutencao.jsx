import { useState } from 'react';
import axios from 'axios';

export function ModalDetalhesManutencao({ manutencao, produto, onClose, onAtualizar }) {
  const [justificativa, setJustificativa] = useState('');
  const [loading, setLoading] = useState(false);

  const atualizarStatus = async (status) => {
    setLoading(true);
    try {
      await axios.patch(`http://localhost:3000/manutencoes/${manutencao.id}`, {
        status,
        justificativa: status === 'revisar' ? justificativa : null
      });
      onAtualizar();
      onClose();
    } catch (err) {
      alert('Erro ao atualizar manutenção');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Detalhes da Manutenção</h2>

        <p><strong>Produto:</strong> {produto?.codigoPublico || 'Não encontrado'}</p>
        <p><strong>Data:</strong> {manutencao.data}</p>
        <p><strong>Responsável:</strong> {manutencao.responsavel}</p>
        <p><strong>Descrição:</strong> {manutencao.descricao}</p>
        <p><strong>Tempo de execução:</strong> {manutencao.tempo}</p>
        <p><strong>Materiais utilizados:</strong> {manutencao.materiais}</p>
        <p><strong>Observações:</strong> {manutencao.observacoes}</p>

        {manutencao.status === 'pendente' && (
          <>
            <div style={{ margin: '1rem 0' }}>
              <textarea
                value={justificativa}
                onChange={e => setJustificativa(e.target.value)}
                placeholder="Justificativa (somente se for revisar)"
                style={{ width: '100%', minHeight: '80px' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => atualizarStatus('aprovado')}
                className="aprovar"
                disabled={loading}
              >
                Aprovar
              </button>
              <button
                onClick={() => atualizarStatus('revisar')}
                className="revisar"
                disabled={loading}
              >
                Revisar
              </button>
            </div>
          </>
        )}

        <button onClick={onClose} style={{ marginTop: '1rem' }}>Fechar</button>
      </div>
    </div>
  );
}
