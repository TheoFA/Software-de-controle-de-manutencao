// index.js
const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();


app.use(cors());
app.use(express.json());

const tiposProdutoRoutes = require('./routes/tiposProduto.js');
const clienteRoutes = require('./routes/clientes');
const produtoRoutes = require('./routes/produtos');
const manutencaoRoutes = require('./routes/manutencoes');

app.use('/tipos-produto', tiposProdutoRoutes);
app.use('/clientes', clienteRoutes);
app.use('/produtos', produtoRoutes);
app.use('/manutencoes', manutencaoRoutes);

app.listen(3000, () => {
  console.log('Servidor backend em http://localhost:3000');
});