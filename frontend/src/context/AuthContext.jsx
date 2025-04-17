// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregarSessao = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user || null;
      setUsuario(user);

      if (user) {
        const { data: perfilData } = await supabase
          .from('perfis')
          .select('tipo, nome')
          .eq('id', user.id)
          .single();
        setPerfil(perfilData);
      }

      setCarregando(false);
    };

    carregarSessao();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user || null;
      setUsuario(user);
      if (user) {
        supabase
          .from('perfis')
          .select('tipo, nome')
          .eq('id', user.id)
          .single()
          .then(({ data }) => setPerfil(data));
      } else {
        setPerfil(null);
      }
    });

    return () => listener?.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, perfil, carregando }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
