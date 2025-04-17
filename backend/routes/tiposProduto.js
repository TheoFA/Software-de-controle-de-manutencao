// backend/routes/tiposProduto.js
const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const verificaToken = require('../middleware/verificaToken');

// GET /tipos-produto – listar todos (admin)
router.get('/', verificaToken('admin'), async (req, res) => {
  const { data, error } = await supabase.from('tipos_produto').select('*');
  if (error) return res.status(500).json({ erro: error.message });
  res.json(data);
});

// POST /tipos-produto – adicionar novo (admin)
router.post('/', verificaToken('admin'), async (req, res) => {
  const { nome, descricao } = req.body;
  const { data, error } = await supabase
    .from('tipos_produto')
    .insert({ nome, descricao })
    .select();

  if (error) return res.status(500).json({ erro: error.message });
  res.status(201).json(data[0]);
});

// PATCH /tipos-produto/:id – editar (admin)
router.patch('/:id', verificaToken('admin'), async (req, res) => {
  const { id } = req.params;
  const { nome, descricao } = req.body;

  const { data, error } = await supabase
    .from('tipos_produto')
    .update({ nome, descricao })
    .eq('id', id)
    .select();

  if (error) return res.status(500).json({ erro: error.message });
  if (!data.length) return res.status(404).json({ erro: 'Tipo não encontrado' });

  res.json(data[0]);
});

// DELETE /tipos-produto/:id – excluir (admin)
router.delete('/:id', verificaToken('admin'), async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('tipos_produto')
    .delete()
    .eq('id', id);

  if (error) return res.status(500).json({ erro: error.message });

  res.status(204).send();
});

module.exports = router;
