// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RoleRoute } from './components/RoleRoute';

import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import FuncionarioPage from './pages/FuncionarioPage';
import "./style.css"

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
              <RoleRoute permitido={['admin']}>
                <AdminPage />
              </RoleRoute>
            }
          />
          <Route
            path="/funcionario"
            element={
              <RoleRoute permitido={['funcionario']}>
                <FuncionarioPage />
              </RoleRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
