import { useEffect, useState } from 'react';
import axios from 'axios';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';

function FuncionarioPage() {
  const [produtos, setProdutos] = useState([]);

  const [produtoId, setProdutoId] = useState('');
  const [descricao, setDescricao] = useState('');
  const [data, setData] = useState('');
  const [tempo, setTempo] = useState('');
  const [materiais, setMateriais] = useState('');
  const [observacoes, setObservacoes] = useState('');

  const [contaAberta, setContaAberta] = useState(false);
  const { perfil } = useAuth();

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    try {
      const res = await axios.get('http://localhost:3000/produtos');
      setProdutos(res.data);
    } catch (err) {
      console.error('Erro ao carregar produtos:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/manutencoes', {
        produtoId,
        descricao,
        data,
        fotos: [],
        responsavel: perfil?.nome || '',
        tempo,
        materiais,
        observacoes
      });
      setProdutoId('');
      setDescricao('');
      setData('');
      setTempo('');
      setMateriais('');
      setObservacoes('');
      alert('Manutenção registrada com sucesso');
    } catch (err) {
      console.error('Erro ao salvar manutenção:', err);
      alert('Erro ao salvar manutenção');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <div className="funcionario-container">
      <div className="admin-navbar">
        <h1>Manutenções</h1>
        <div style={{ position: 'relative' }}>
          <button className="admin-account" title="Conta" onClick={() => setContaAberta(!contaAberta)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
              <path d="M12 12c2.7 0 4.5-2 4.5-4.5S14.7 3 12 3 7.5 5 7.5 7.5 9.3 12 12 12zm0 1.5c-3 0-9 1.5-9 4.5v1.5h18V18c0-3-6-4.5-9-4.5z" />
            </svg>
          </button>
          {contaAberta && (
            <div style={{ position: 'absolute', right: 0, top: '2.5rem', background: 'white', color: '#1f2937', boxShadow: '0 2px 6px rgba(0,0,0,0.1)', borderRadius: 6, padding: '0.75rem 1rem', minWidth: '200px', zIndex: 100 }}>
              <p style={{ margin: 0, fontWeight: 'bold' }}>Logado como:</p>
              <p style={{ margin: '0.25rem 0 1rem' }}>{perfil?.nome || 'Funcionário'}</p>
              <button onClick={handleLogout} style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: 4, padding: '0.5rem 1rem', cursor: 'pointer' }}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <h2>Registrar Manutenção</h2>

        <select value={produtoId} onChange={e => setProdutoId(e.target.value)} required>
          <option value="">Selecione o produto</option>
          {produtos.map(p => (
            <option key={p.id} value={p.id}>{p.codigoPublico} - Nº {p.numeroSerie}</option>
          ))}
        </select>

        <input
          type="text"
          value={tempo}
          onChange={e => setTempo(e.target.value)}
          placeholder="Tempo de execução (ex: 1h30)"
        />

        <textarea
          value={descricao}
          onChange={e => setDescricao(e.target.value)}
          placeholder="Descrição do serviço"
          required
        />

        <textarea
          value={materiais}
          onChange={e => setMateriais(e.target.value)}
          placeholder="Materiais utilizados"
        />

        <textarea
          value={observacoes}
          onChange={e => setObservacoes(e.target.value)}
          placeholder="Observações técnicas"
        />

        <input
          type="date"
          value={data}
          onChange={e => setData(e.target.value)}
          required
        />

        <button type="submit">Salvar Manutenção</button>
      </form>
    </div>
  );
}

export default FuncionarioPage;
