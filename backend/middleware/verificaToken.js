// backend/middleware/verificaToken.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = function verificaToken(tipoPermitido) {
  return async function (req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ erro: 'Token não fornecido' });
    }

    const { data: userData, error } = await supabase.auth.getUser(token);

    if (error || !userData?.user) {
      return res.status(401).json({ erro: 'Token inválido ou expirado' });
    }

    const userId = userData.user.id;
    const { data: perfil, error: perfilError } = await supabase
      .from('perfis')
      .select('tipo')
      .eq('id', userId)
      .single();

    if (perfilError || !perfil) {
      return res.status(403).json({ erro: 'Perfil não encontrado' });
    }

    if (tipoPermitido && perfil.tipo !== tipoPermitido) {
      return res.status(403).json({ erro: 'Permissão insuficiente' });
    }

    req.usuario = userData.user;
    req.perfil = perfil.tipo;
    next();
  };
};
