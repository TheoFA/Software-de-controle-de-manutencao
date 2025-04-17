import { useState } from 'react';
import { ManutencaoAprovacao } from '../components/admincomponents/ManutencaoAprovacao';
import { HistoricoStatus } from '../components/admincomponents/HistoricoStatus';
import PesquisarManutencoes from '../components/admincomponents/PesquisarManutencoes';

function ManutencaoPage({ manutencoes, setManutencoes, produtos }) {
  const [aba, setAba] = useState('pendentes');

  return (
    <div>
      <div className="subnavbar" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <button className={aba === 'pendentes' ? 'active' : ''} onClick={() => setAba('pendentes')}>Pendentes</button>
        <button className={aba === 'aprovadas' ? 'active' : ''} onClick={() => setAba('aprovadas')}>Aprovadas</button>
        <button className={aba === 'revisar' ? 'active' : ''} onClick={() => setAba('revisar')}>Revisar</button>
        <button className={aba === 'pesquisar' ? 'active' : ''} onClick={() => setAba('pesquisar')}>Pesquisar</button>
      </div>

      {aba === 'pendentes' && (
        <ManutencaoAprovacao
          manutencoes={manutencoes}
          setManutencoes={setManutencoes}
          produtos={produtos}
        />
      )}

      {aba === 'aprovadas' && (
        <HistoricoStatus
          manutencoes={manutencoes}
          setManutencoes={setManutencoes}
          produtos={produtos}
          status="aprovado"
          cor="#4ade80"
          rotulo="Aprovado"
        />
      )}

      {aba === 'revisar' && (
        <HistoricoStatus
          manutencoes={manutencoes}
          setManutencoes={setManutencoes}
          produtos={produtos}
          status="revisar"
          cor="#f87171"
          rotulo="Revisar"
        />
      )}

      {aba === 'pesquisar' && <PesquisarManutencoes />}
    </div>
  );
}

export default ManutencaoPage;
