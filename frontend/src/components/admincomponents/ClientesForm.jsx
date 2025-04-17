import { useState, useEffect } from 'react';
import axios from 'axios';

export function ClientesForm({ clientes, setClientes }) {
  const [nome, setNome] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [contato, setContato] = useState('');
  const [busca, setBusca] = useState('');

  useEffect(() => {
    carregarClientes();
  }, []);

  async function carregarClientes() {
    try {
      const res = await axios.get('http://localhost:3000/clientes');
      setClientes(res.data);
    } catch (err) {
      console.error('Erro ao carregar clientes:', err);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:3000/clientes', {
        nome,
        empresa,
        contato,
      });
      setClientes([...clientes, res.data]);
      setNome('');
      setEmpresa('');
      setContato('');
    } catch (err) {
      console.error('Erro ao cadastrar cliente:', err.message);
      alert('Erro ao salvar: ' + err.message);
    }
  };

  const clientesFiltrados = clientes.filter(c =>
    c.nome.toLowerCase().includes(busca.toLowerCase()) ||
    c.empresa.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Cadastrar Cliente</h2>
        <input
          value={nome}
          onChange={e => setNome(e.target.value)}
          placeholder="Nome"
          required
        />
        <input
          value={empresa}
          onChange={e => setEmpresa(e.target.value)}
          placeholder="Empresa"
          required
        />
        <input
          value={contato}
          onChange={e => setContato(e.target.value)}
          placeholder="Contato"
          required
        />
        <button type="submit">Salvar</button>
      </form>

      <input
        type="text"
        value={busca}
        onChange={e => setBusca(e.target.value)}
        placeholder="Buscar cliente..."
        style={{ marginTop: '1rem', padding: '0.5rem', width: '100%' }}
      />

      <table style={{ marginTop: '1rem', width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f3f4f6' }}>
            <th style={{ textAlign: 'left', padding: '8px' }}>ID</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Nome</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Empresa</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Contato</th>
          </tr>
        </thead>
        <tbody>
          {clientesFiltrados.map(c => (
            <tr key={c.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '8px' }}>{c.id}</td>
              <td style={{ padding: '8px' }}>{c.nome}</td>
              <td style={{ padding: '8px' }}>{c.empresa}</td>
              <td style={{ padding: '8px' }}>{c.contato}</td>
            </tr>
          ))}
          {clientesFiltrados.length === 0 && (
            <tr>
              <td colSpan="4" style={{ padding: '8px', textAlign: 'center' }}>
                Nenhum cliente encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
