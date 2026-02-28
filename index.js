const express = require('express');
const app = express();

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
    endpoints: ['/estudiantes', '/profesores', '/materias', '/notas']
  });
});

// ─── Manejo de rutas no encontradas ───────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Ruta no encontrada' });
});

const server = app.listen(3000, () =>
  console.log(`\n🏫 API Colegio corriendo en http://localhost:${server.address().port}\n`)
);
