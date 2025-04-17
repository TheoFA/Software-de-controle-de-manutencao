// backend/routes/produtos.js
const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const verificaToken = require('../middleware/verificaToken');

// GET /produtos – listar (apenas admins)
router.get('/', verificaToken('admin'), async (req, res) => {
  const { data, error } = await supabase.from('produtos').select('*');
  if (error) return res.status(500).json({ erro: error.message });
  res.json(data);
});

// POST /produtos – cadastrar novo (apenas admins)
router.post('/', verificaToken('admin'), async (req, res) => {
  const codigoPublico = 'PROD-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  const { clienteId, tipoProdutoId, numeroSerie, dataAquisicao } = req.body;

  const { data, error } = await supabase
    .from('produtos')
    .insert({
      clienteId,
      tipoProdutoId,
      numeroSerie,
      dataAquisicao,
      codigoPublico
    })
    .select();

  if (error) return res.status(500).json({ erro: error.message });
  res.status(201).json(data[0]);
});

module.exports = router;
