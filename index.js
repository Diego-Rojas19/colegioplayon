// index.js — Servidor principal API Colegio

const express = require('express');
const app = express();

const db = require('./db'); // conecta la base de datos al iniciar

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
    endpoints: {
      'GET    /estudiantes':     'Listar estudiantes (filtros: ?nombre=&grado=&activo=)',
      'GET    /estudiantes/:id': 'Ver un estudiante',
      'POST   /estudiantes':     'Crear estudiante { nombre, email, grado, edad }',
      'PUT    /estudiantes/:id': 'Actualizar estudiante',
      'DELETE /estudiantes/:id': 'Eliminar estudiante',
      'GET    /profesores':      'Listar profesores (filtros: ?nombre=&especialidad=)',
      'GET    /profesores/:id':  'Ver un profesor',
      'POST   /profesores':      'Crear profesor { nombre, email, especialidad }',
      'PUT    /profesores/:id':  'Actualizar profesor',
      'DELETE /profesores/:id':  'Eliminar profesor',
      'GET    /materias':        'Listar materias (filtros: ?nombre=&activa=)',
      'GET    /materias/:id':    'Ver una materia',
      'POST   /materias':        'Crear materia { nombre, codigo, profesorId, creditos }',
      'PUT    /materias/:id':    'Actualizar materia',
      'DELETE /materias/:id':    'Eliminar materia',
      'GET    /notas':           'Listar notas (filtros: ?estudianteId=&materiaId=&periodo=)',
      'GET    /notas/:id':       'Ver una nota',
      'POST   /notas':           'Crear nota { estudianteId, materiaId, nota, periodo }',
      'PUT    /notas/:id':       'Actualizar nota',
      'DELETE /notas/:id':       'Eliminar nota'
    }
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

const server = app.listen(3000, () =>
  console.log(`🏫 API Colegio corriendo en http://localhost:${server.address().port}`)
);