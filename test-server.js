// test-server.js
const express = require('express');
const app = express();
const PORT = 3001; // Puerto diferente

app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'Servidor de prueba funcionando!' });
});

// Ruta simple de productos
app.get('/api/products', (req, res) => {
  res.json([
    { id: 1, name: 'Producto 1', price: 19.99 },
    { id: 2, name: 'Producto 2', price: 29.99 }
  ]);
});

app.listen(PORT, () => {
  console.log(`✅ Servidor de prueba en: http://localhost:${PORT}`);
});