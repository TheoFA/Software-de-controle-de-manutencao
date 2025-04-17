import { useEffect, useState } from 'react';
import { ClientesForm } from "../components/admincomponents/ClientesForm";
import { TiposProdutoForm } from "../components/admincomponents/TiposProdutoForm";
import { ProdutosForm } from "../components/admincomponents/ProdutosForm";
import ManutencaoPage from "./ManutencaoPage";
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';

function AdminPage() {
  const [secao, setSecao] = useState('clientes');
  const [tipos, setTipos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [manutencoes, setManutencoes] = useState([]);
  const [menuAberto, setMenuAberto] = useState(false);
  const [contaAberta, setContaAberta] = useState(false);

  const { perfil } = useAuth();

  useEffect(() => {
    const carregarTudo = async () => {
      const [tiposRes, clientesRes, produtosRes, manutencoesRes] = await Promise.all([
        fetch('http://localhost:3000/tipos-produto').then(res => res.json()),
        fetch('http://localhost:3000/clientes').then(res => res.json()),
        fetch('http://localhost:3000/produtos').then(res => res.json()),
        fetch('http://localhost:3000/manutencoes').then(res => res.json())
      ]);

      setTipos(tiposRes);
      setClientes(clientesRes);
      setProdutos(produtosRes);
      setManutencoes(manutencoesRes);
    };

    carregarTudo();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <div className="admin-container">
      <div className="admin-navbar">
        <h1>Manutenção</h1>
        <div className="admin-tabs">
          <button className={secao === 'clientes' ? 'active' : ''} onClick={() => setSecao('clientes')}>Clientes</button>
          <button className={secao === 'tipos' ? 'active' : ''} onClick={() => setSecao('tipos')}>Tipos</button>
          <button className={secao === 'produtos' ? 'active' : ''} onClick={() => setSecao('produtos')}>Produtos</button>
          <button className={secao === 'manutencao' ? 'active' : ''} onClick={() => setSecao('manutencao')}>Manutenções</button>
        </div>
        <div style={{ position: 'relative' }}>
          <button className="admin-account" title="Conta" onClick={() => setContaAberta(!contaAberta)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
              <path d="M12 12c2.7 0 4.5-2 4.5-4.5S14.7 3 12 3 7.5 5 7.5 7.5 9.3 12 12 12zm0 1.5c-3 0-9 1.5-9 4.5v1.5h18V18c0-3-6-4.5-9-4.5z" />
            </svg>
          </button>
          {contaAberta && (
            <div style={{ position: 'absolute', right: 0, top: '2.5rem', background: 'white', color: '#1f2937', boxShadow: '0 2px 6px rgba(0,0,0,0.1)', borderRadius: 6, padding: '0.75rem 1rem', minWidth: '200px', zIndex: 100 }}>
              <p style={{ margin: 0, fontWeight: 'bold' }}>Logado como:</p>
              <p style={{ margin: '0.25rem 0 1rem' }}>{perfil?.nome || 'Usuário'}</p>
              <button onClick={handleLogout} style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: 4, padding: '0.5rem 1rem', cursor: 'pointer' }}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <main style={{ padding: '1rem' }}>
        {secao === 'clientes' && <ClientesForm clientes={clientes} setClientes={setClientes} />}
        {secao === 'tipos' && <TiposProdutoForm tipos={tipos} setTipos={setTipos} />}
        {secao === 'produtos' && <ProdutosForm produtos={produtos} setProdutos={setProdutos} clientes={clientes} tipos={tipos} />}
        {secao === 'manutencao' && <ManutencaoPage manutencoes={manutencoes} setManutencoes={setManutencoes} produtos={produtos} />}
      </main>
    </div>
  );
}

export default AdminPage;
