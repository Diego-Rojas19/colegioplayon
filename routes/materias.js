const express = require('express');
const router = express.Router();

// ─── Base de datos simulada ────────────────────────────────
let materias = [
  { id: 1, nombre: 'Matemáticas',       codigo: 'MAT-01', profesorId: 1, creditos: 4, activa: true },
  { id: 2, nombre: 'Ciencias Naturales', codigo: 'CIE-01', profesorId: 2, creditos: 3, activa: true },
  { id: 3, nombre: 'Historia',           codigo: 'HIS-01', profesorId: 3, creditos: 3, activa: true },
  { id: 4, nombre: 'Inglés',             codigo: 'ING-01', profesorId: 4, creditos: 4, activa: false },
];
let nextId = 5;

// ─── GET /materias ─────────────────────────────────────────
// Filtros: ?nombre=Matemáticas&activa=true
// Header: x-grado (grado que solicita la consulta)
router.get('/', (req, res) => {
  const grado   = req.headers['x-grado'] || 'No especificado';
  const filtros = req.query;

  let resultado = [...materias];

  if (Object.keys(filtros).length > 0) {
    resultado = resultado.filter(m =>
      Object.entries(filtros).every(([k, v]) =>
        m[k]?.toString().toLowerCase().includes(v.toLowerCase())
      )
    );
  }

  res.json({
    success: true,
    total: resultado.length,
    grado_consultante: grado,
    data: resultado
  });
});

// ─── GET /materias/:id ─────────────────────────────────────
router.get('/:id', (req, res) => {
  const materia = materias.find(m => m.id === parseInt(req.params.id));
  if (!materia) {
    return res.status(404).json({ success: false, message: 'Materia no encontrada' });
  }
  res.json({ success: true, data: materia });
});

// ─── POST /materias ────────────────────────────────────────
router.post('/', (req, res) => {
  const { nombre, codigo, profesorId, creditos } = req.body;

  if (!nombre || !codigo || !profesorId || !creditos) {
    return res.status(400).json({
      success: false,
      message: 'Campos requeridos: nombre, codigo, profesorId, creditos'
    });
  }

  const nueva = { id: nextId++, nombre, codigo, profesorId: parseInt(profesorId), creditos: parseInt(creditos), activa: true };
  materias.push(nueva);

  res.status(201).json({ success: true, message: 'Materia creada exitosamente', data: nueva });
});

// ─── PUT /materias/:id ─────────────────────────────────────
router.put('/:id', (req, res) => {
  const idx = materias.findIndex(m => m.id === parseInt(req.params.id));
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Materia no encontrada' });
  }

  const { nombre, codigo, profesorId, creditos, activa } = req.body;
  if (!nombre && !codigo && !profesorId && !creditos && activa === undefined) {
    return res.status(400).json({ success: false, message: 'Debe enviar al menos un campo para actualizar' });
  }

  materias[idx] = {
    ...materias[idx],
    ...(nombre     !== undefined && { nombre }),
    ...(codigo     !== undefined && { codigo }),
    ...(profesorId !== undefined && { profesorId: parseInt(profesorId) }),
    ...(creditos   !== undefined && { creditos: parseInt(creditos) }),
    ...(activa     !== undefined && { activa: activa === 'false' ? false : Boolean(activa) }),
  };

  res.json({ success: true, message: 'Materia actualizada', data: materias[idx] });
});

// ─── DELETE /materias/:id ──────────────────────────────────
router.delete('/:id', (req, res) => {
  const idx = materias.findIndex(m => m.id === parseInt(req.params.id));
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Materia no encontrada' });
  }

  const eliminada = materias.splice(idx, 1)[0];
  res.json({ success: true, message: 'Materia eliminada', data: eliminada });
});

module.exports = router;
