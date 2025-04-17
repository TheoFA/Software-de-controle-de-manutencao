import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');

    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password: senha
    });

    if (loginError) {
      setErro('Credenciais inválidas.');
      return;
    }

    const { data: perfilData } = await supabase.from('perfis').select('*').eq('id', loginData.user.id).single();

    if (!perfilData) {
      setErro('Perfil não encontrado.');
      return;
    }

    // Redireciona conforme o tipo de usuário
    if (perfilData.tipo === 'admin') navigate('/admin');
    else if (perfilData.tipo === 'funcionario') navigate('/funcionario');
    else setErro('Tipo de usuário inválido.');
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={senha} onChange={e => setSenha(e.target.value)} placeholder="Senha" required />
        <button type="submit">Entrar</button>
        {erro && <p style={{ color: 'red' }}>{erro}</p>}
      </form>
    </div>
  );
}

export default LoginPage;
