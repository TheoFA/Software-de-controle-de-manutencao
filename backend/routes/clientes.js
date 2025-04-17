
// backend/routes/clientes.js
const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const verificaToken = require('../middleware/verificaToken');

// GET /clientes – lista todos os clientes (apenas admins)
router.get('/', verificaToken('admin'), async (req, res) => {
  const { data, error } = await supabase.from('clientes').select('*');
  if (error) return res.status(500).json({ erro: error.message });
  res.json(data);
});

// POST /clientes – adiciona um novo cliente (apenas admins)
router.post('/', verificaToken('admin'), async (req, res) => {
  const { nome, empresa, contato } = req.body;
  const { data, error } = await supabase
    .from('clientes')
    .insert({ nome, empresa, contato })
    .select();

  if (error) return res.status(500).json({ erro: error.message });
  res.status(201).json(data[0]);
});

module.exports = router;
