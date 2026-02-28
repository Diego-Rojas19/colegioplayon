const express = require('express');
const router = express.Router();

// ─── Base de datos simulada ────────────────────────────────
let notas = [
  { id: 1, estudianteId: 1, materiaId: 1, nota: 4.5, periodo: 'P1-2025', fecha: '2025-03-15' },
  { id: 2, estudianteId: 1, materiaId: 2, nota: 3.8, periodo: 'P1-2025', fecha: '2025-03-16' },
  { id: 3, estudianteId: 2, materiaId: 1, nota: 2.9, periodo: 'P1-2025', fecha: '2025-03-15' },
  { id: 4, estudianteId: 3, materiaId: 3, nota: 4.0, periodo: 'P1-2025', fecha: '2025-03-17' },
];
let nextId = 5;

// ─── GET /notas ────────────────────────────────────────────
// Filtros: ?estudianteId=1&periodo=P1-2025&materiaId=2
// Header: x-rol (rol del usuario que consulta: admin, profesor, estudiante)
router.get('/', (req, res) => {
  const rol     = req.headers['x-rol'] || 'invitado';
  const filtros = req.query;

  let resultado = [...notas];

  if (Object.keys(filtros).length > 0) {
    resultado = resultado.filter(n =>
      Object.entries(filtros).every(([k, v]) =>
        n[k]?.toString().toLowerCase().includes(v.toLowerCase())
      )
    );
  }

  // Los estudiantes solo pueden ver notas aprobadas (simulación de permisos por rol)
  if (rol === 'estudiante') {
    resultado = resultado.filter(n => n.nota >= 3.0);
  }

  res.json({
    success: true,
    total: resultado.length,
    rol_consultante: rol,
    data: resultado
  });
});

// ─── GET /notas/:id ────────────────────────────────────────
router.get('/:id', (req, res) => {
  const nota = notas.find(n => n.id === parseInt(req.params.id));
  if (!nota) {
    return res.status(404).json({ success: false, message: 'Nota no encontrada' });
  }
  res.json({ success: true, data: nota });
});

// ─── POST /notas ───────────────────────────────────────────
router.post('/', (req, res) => {
  const { estudianteId, materiaId, nota, periodo } = req.body;

  if (!estudianteId || !materiaId || nota === undefined || !periodo) {
    return res.status(400).json({
      success: false,
      message: 'Campos requeridos: estudianteId, materiaId, nota, periodo'
    });
  }

  const notaNum = parseFloat(nota);
  if (isNaN(notaNum) || notaNum < 0 || notaNum > 5) {
    return res.status(400).json({
      success: false,
      message: 'La nota debe ser un número entre 0.0 y 5.0'
    });
  }

  const nueva = {
    id: nextId++,
    estudianteId: parseInt(estudianteId),
    materiaId: parseInt(materiaId),
    nota: notaNum,
    periodo,
    fecha: new Date().toISOString().split('T')[0]
  };
  notas.push(nueva);

  res.status(201).json({ success: true, message: 'Nota registrada exitosamente', data: nueva });
});

// ─── PUT /notas/:id ────────────────────────────────────────
router.put('/:id', (req, res) => {
  const idx = notas.findIndex(n => n.id === parseInt(req.params.id));
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Nota no encontrada' });
  }

  const { estudianteId, materiaId, nota, periodo } = req.body;
  if (!estudianteId && !materiaId && nota === undefined && !periodo) {
    return res.status(400).json({ success: false, message: 'Debe enviar al menos un campo para actualizar' });
  }

  if (nota !== undefined) {
    const notaNum = parseFloat(nota);
    if (isNaN(notaNum) || notaNum < 0 || notaNum > 5) {
      return res.status(400).json({ success: false, message: 'La nota debe ser entre 0.0 y 5.0' });
    }
  }

  notas[idx] = {
    ...notas[idx],
    ...(estudianteId !== undefined && { estudianteId: parseInt(estudianteId) }),
    ...(materiaId    !== undefined && { materiaId: parseInt(materiaId) }),
    ...(nota         !== undefined && { nota: parseFloat(nota) }),
    ...(periodo      !== undefined && { periodo }),
  };

  res.json({ success: true, message: 'Nota actualizada', data: notas[idx] });
});

// ─── DELETE /notas/:id ─────────────────────────────────────
router.delete('/:id', (req, res) => {
  const idx = notas.findIndex(n => n.id === parseInt(req.params.id));
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Nota no encontrada' });
  }

  const eliminada = notas.splice(idx, 1)[0];
  res.json({ success: true, message: 'Nota eliminada', data: eliminada });
});

module.exports = router;
