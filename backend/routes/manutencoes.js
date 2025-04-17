// backend/routes/manutencoes.js
const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const verificaToken = require('../middleware/verificaToken');

// GET /manutencoes — listar (admin ou funcionário)
router.get('/', verificaToken(), async (req, res) => {
  const { data, error } = await supabase.from('manutencoes').select('*');
  if (error) return res.status(500).json({ erro: error.message });
  res.json(data);
});

// POST /manutencoes — funcionário pode registrar
router.post('/', verificaToken('funcionario'), async (req, res) => {
  const {
    produtoId,
    descricao,
    data,
    fotos = [],
    responsavel,
    tempo,
    materiais,
    observacoes,
    justificativa
  } = req.body;

  const { data: resultado, error } = await supabase
    .from('manutencoes')
    .insert({
      produtoId,
      descricao,
      data,
      status: 'pendente',
      fotos,
      responsavel,
      tempo,
      materiais,
      observacoes,
      justificativa
    })
    .select();

  if (error) return res.status(500).json({ erro: error.message });
  res.status(201).json(resultado[0]);
});

// PATCH /manutencoes/:id — admin pode aprovar/revisar
router.patch('/:id', verificaToken('admin'), async (req, res) => {
  const { id } = req.params;
  const atualizacoes = req.body;

  const { data, error } = await supabase
    .from('manutencoes')
    .update(atualizacoes)
    .eq('id', id)
    .select();

  if (error) return res.status(500).json({ erro: error.message });
  if (!data.length) return res.status(404).json({ erro: 'Manutenção não encontrada' });

  res.json(data[0]);
});

module.exports = router;
