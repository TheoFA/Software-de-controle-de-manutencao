import { useState, useEffect } from 'react';
import axios from 'axios';


export function TiposProdutoForm({ tipos, setTipos }) {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [modoEdicao, setModoEdicao] = useState(false);
  const [tipoEditando, setTipoEditando] = useState(null);

  useEffect(() => {
    carregarTipos();
  }, []);
  
  async function carregarTipos() {
    try {
      const res = await axios.get('http://localhost:3000/tipos-produto');
      setTipos(res.data);
    } catch (err) {
      console.error('Erro ao carregar tipos:', err);
    }
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modoEdicao && tipoEditando) {
        const res = await axios.patch(`http://localhost:3000/tipos-produto/${tipoEditando.id}`, {
          nome,
          descricao
        });
      } else {
        const res = await axios.post('http://localhost:3000/tipos-produto', {
          nome,
          descricao
        });
        setTipos([...tipos, res.data]);
      }
  
      await carregarTipos();
      setNome('');
      setDescricao('');
      setModoEdicao(false);
      setTipoEditando(null);
    } catch (err) {
      console.error('Erro ao salvar tipo:', err);
      alert('Erro ao salvar');
    }
  };
  

  const iniciarEdicao = (tipo) => {
    setModoEdicao(true);
    setTipoEditando(tipo);
    setNome(tipo.nome);
    setDescricao(tipo.descricao);
  };

  const excluirTipo = async (id) => {
    const confirmar = window.confirm('Deseja excluir este tipo de produto?');
    if (!confirmar) return;
  
    try {
      await axios.delete(`http://localhost:3000/tipos-produto/${id}`);
      await carregarTipos();
    } catch (err) {
      alert('Erro ao excluir tipo.');
    }
  };
  

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>{modoEdicao ? 'Editar Tipo de Produto' : 'Cadastrar Tipo de Produto'}</h2>
        <input
          value={nome}
          onChange={e => setNome(e.target.value)}
          placeholder="Nome"
          required
        />
        <textarea
          value={descricao}
          onChange={e => setDescricao(e.target.value)}
          placeholder="Descrição"
          required
        />
        <button type="submit">{modoEdicao ? 'Salvar Edição' : 'Cadastrar'}</button>
        {modoEdicao && (
          <button
            type="button"
            onClick={() => {
              setModoEdicao(false);
              setTipoEditando(null);
              setNome('');
              setDescricao('');
            }}
            style={{ backgroundColor: '#f87171', marginTop: '0.5rem' }}
          >
            Cancelar Edição
          </button>
        )}
      </form>

      <div style={{ overflowX: 'auto', marginTop: '2rem' }}>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {tipos.map(t => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.nome}</td>
                <td>{t.descricao}</td>
                <td>
                  <button onClick={() => iniciarEdicao(t)}>Editar</button>
                  <button
                    onClick={() => excluirTipo(t.id)}
                    style={{ marginLeft: '0.5rem', backgroundColor: '#ef4444' }}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
            {tipos.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center' }}>
                  Nenhum tipo de produto cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
