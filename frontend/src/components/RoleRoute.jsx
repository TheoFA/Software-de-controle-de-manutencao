// src/components/RoleRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function RoleRoute({ children, permitido }) {
  const { usuario, perfil, carregando } = useAuth();

  if (carregando) return <p>Carregando...</p>;

  if (!usuario || !perfil) return <Navigate to="/login" />;

  if (permitido.includes(perfil.tipo)) {
    return children;
  }

  return <Navigate to="/login" />;
}
