// index.js — Servidor principal API Colegio

require('dotenv').config(); // ← AGREGADO

const express = require('express');
const app = express();

const db = require('./db');

app.use(express.json());

// ─── Rutas ────────────────────────────────────────────────
app.use('/estudiantes', require('./routes/estudiantes'));
app.use('/profesores',  require('./routes/profesores'));
app.use('/materias',    require('./routes/materias'));
app.use('/notas',       require('./routes/notas'));

// ─── Ruta raíz ────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🏫 API REST - Sistema de Colegio | SENA Proyecto 5',
    version: '2.0.0 - SQLite',
    endpoints: { /* ... */ }
  });
});

// ─── Manejo de rutas no encontradas ───────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Ruta no encontrada' });
});

// ─── Manejo global de errores ─────────────────────────────
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ success: false, message: 'Error interno del servidor' });
});

// ─── Puerto desde variable de entorno ─────────────────────
const PORT = process.env.PORT || 3000; // ← MODIFICADO
const server = app.listen(PORT, () =>
  console.log(`🏫 API Colegio corriendo en http://localhost:${server.address().port}`)
);
```

Y en tu archivo `.env` agregas:
```
PORT=3000