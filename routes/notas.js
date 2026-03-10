// routes/notas.js — CRUD de notas con SQLite y validaciones

const express = require('express');
const router  = express.Router();
const db      = require('../db');

// ─── GET /notas ────────────────────────────────────────────
// Filtros: ?estudianteId=1&periodo=P1-2025&materiaId=2
// Header: x-rol (admin, profesor, estudiante)
router.get('/', (req, res) => {
  const rol = req.headers['x-rol'] || 'invitado';

  const condiciones = [];
  const valores     = [];

  if (req.query.estudianteId) {
    condiciones.push("estudianteId = ?");
    valores.push(parseInt(req.query.estudianteId));
  }
  if (req.query.materiaId) {
    condiciones.push("materiaId = ?");
    valores.push(parseInt(req.query.materiaId));
  }
  if (req.query.periodo) {
    condiciones.push("periodo LIKE ?");
    valores.push(`%${req.query.periodo}%`);
  }

  // Los estudiantes solo ven notas aprobadas
  if (rol === 'estudiante') {
    condiciones.push("nota >= 3.0");
  }

  const where = condiciones.length > 0 ? `WHERE ${condiciones.join(' AND ')}` : '';
  const sql   = `SELECT * FROM notas ${where} ORDER BY id ASC`;

  db.all(sql, valores, (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: err.message });

    res.json({
      success: true,
      total: rows.length,
      rol_consultante: rol,
      data: rows
    });
  });
});

// ─── GET /notas/:id ────────────────────────────────────────
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM notas WHERE id = ?', [req.params.id], (err, row) => {
    if (err)  return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'Nota no encontrada' });

    res.json({ success: true, data: row });
  });
});

// ─── POST /notas ───────────────────────────────────────────
router.post('/', (req, res) => {
  const { estudianteId, materiaId, nota, periodo } = req.body;

  // Validación: campos obligatorios
  if (!estudianteId || !materiaId || nota === undefined || !periodo) {
    return res.status(400).json({
      success: false,
      message: 'Campos requeridos: estudianteId, materiaId, nota, periodo'
    });
  }

  // Validación: nota debe ser número entre 0.0 y 5.0
  const notaNum = parseFloat(nota);
  if (isNaN(notaNum) || notaNum < 0 || notaNum > 5) {
    return res.status(400).json({ success: false, message: 'La nota debe ser un número entre 0.0 y 5.0' });
  }

  // Validación: IDs deben ser números enteros
  const estId = parseInt(estudianteId);
  const matId = parseInt(materiaId);
  if (isNaN(estId) || isNaN(matId)) {
    return res.status(400).json({ success: false, message: 'estudianteId y materiaId deben ser números enteros' });
  }

  // Validación: el estudiante debe existir
  db.get('SELECT id FROM estudiantes WHERE id = ?', [estId], (err, est) => {
    if (err)  return res.status(500).json({ success: false, message: err.message });
    if (!est) return res.status(400).json({ success: false, message: `No existe un estudiante con id ${estId}` });

    // Validación: la materia debe existir
    db.get('SELECT id FROM materias WHERE id = ?', [matId], (err, mat) => {
      if (err)  return res.status(500).json({ success: false, message: err.message });
      if (!mat) return res.status(400).json({ success: false, message: `No existe una materia con id ${matId}` });

      db.run(
        'INSERT INTO notas (estudianteId, materiaId, nota, periodo) VALUES (?, ?, ?, ?)',
        [estId, matId, notaNum, periodo.trim()],
        function (err) {
          if (err) return res.status(500).json({ success: false, message: err.message });

          db.get('SELECT * FROM notas WHERE id = ?', [this.lastID], (err, nueva) => {
            res.status(201).json({
              success: true,
              message: 'Nota registrada exitosamente',
              data: nueva
            });
          });
        }
      );
    });
  });
});

// ─── PUT /notas/:id ────────────────────────────────────────
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { estudianteId, materiaId, nota, periodo } = req.body;

  if (!estudianteId && !materiaId && nota === undefined && !periodo) {
    return res.status(400).json({ success: false, message: 'Debe enviar al menos un campo para actualizar' });
  }

  // Validación: nota si se envía
  if (nota !== undefined) {
    const notaNum = parseFloat(nota);
    if (isNaN(notaNum) || notaNum < 0 || notaNum > 5) {
      return res.status(400).json({ success: false, message: 'La nota debe ser entre 0.0 y 5.0' });
    }
  }

  db.get('SELECT * FROM notas WHERE id = ?', [id], (err, row) => {
    if (err)  return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'Nota no encontrada' });

    const campos  = [];
    const valores = [];

    if (estudianteId !== undefined) { campos.push('estudianteId = ?'); valores.push(parseInt(estudianteId)); }
    if (materiaId    !== undefined) { campos.push('materiaId = ?');    valores.push(parseInt(materiaId)); }
    if (nota         !== undefined) { campos.push('nota = ?');         valores.push(parseFloat(nota)); }
    if (periodo      !== undefined) { campos.push('periodo = ?');      valores.push(periodo.trim()); }

    valores.push(id);

    db.run(`UPDATE notas SET ${campos.join(', ')} WHERE id = ?`, valores, function (err) {
      if (err) return res.status(500).json({ success: false, message: err.message });

      db.get('SELECT * FROM notas WHERE id = ?', [id], (err, actualizada) => {
        res.json({ success: true, message: 'Nota actualizada', data: actualizada });
      });
    });
  });
});

// ─── DELETE /notas/:id ─────────────────────────────────────
router.delete('/:id', (req, res) => {
  db.get('SELECT * FROM notas WHERE id = ?', [req.params.id], (err, row) => {
    if (err)  return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'Nota no encontrada' });

    db.run('DELETE FROM notas WHERE id = ?', [req.params.id], (err) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, message: 'Nota eliminada', data: row });
    });
  });
});

module.exports = router;