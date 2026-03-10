// routes/materias.js — CRUD de materias con SQLite y validaciones

const express = require('express');
const router  = express.Router();
const db      = require('../db');

// ─── GET /materias ─────────────────────────────────────────
// Filtros: ?nombre=Matemáticas&activa=true
// Header: x-grado
router.get('/', (req, res) => {
  const grado = req.headers['x-grado'] || 'No especificado';

  const condiciones = [];
  const valores     = [];

  if (req.query.nombre) {
    condiciones.push("nombre LIKE ?");
    valores.push(`%${req.query.nombre}%`);
  }
  if (req.query.activa !== undefined) {
    condiciones.push("activa = ?");
    valores.push(req.query.activa === 'true' ? 1 : 0);
  }

  const where = condiciones.length > 0 ? `WHERE ${condiciones.join(' AND ')}` : '';
  const sql   = `SELECT * FROM materias ${where} ORDER BY id ASC`;

  db.all(sql, valores, (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: err.message });

    res.json({
      success: true,
      total: rows.length,
      grado_consultante: grado,
      data: rows.map(m => ({ ...m, activa: m.activa === 1 }))
    });
  });
});

// ─── GET /materias/:id ─────────────────────────────────────
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM materias WHERE id = ?', [req.params.id], (err, row) => {
    if (err)  return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'Materia no encontrada' });

    res.json({ success: true, data: { ...row, activa: row.activa === 1 } });
  });
});

// ─── POST /materias ────────────────────────────────────────
router.post('/', (req, res) => {
  const { nombre, codigo, profesorId, creditos } = req.body;

  // Validación: campos obligatorios
  if (!nombre || !codigo || !profesorId || creditos === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Campos requeridos: nombre, codigo, profesorId, creditos'
    });
  }

  // Validación: créditos debe ser número entero positivo
  const creditosNum = parseInt(creditos);
  if (isNaN(creditosNum) || creditosNum <= 0) {
    return res.status(400).json({ success: false, message: 'creditos debe ser un número entero mayor a 0' });
  }

  // Validación: profesorId debe ser número
  const profesorIdNum = parseInt(profesorId);
  if (isNaN(profesorIdNum)) {
    return res.status(400).json({ success: false, message: 'profesorId debe ser un número válido' });
  }

  // Validación: unicidad del código
  db.get('SELECT id FROM materias WHERE codigo = ?', [codigo], (err, row) => {
    if (err)  return res.status(500).json({ success: false, message: err.message });
    if (row)  return res.status(400).json({ success: false, message: `El código '${codigo}' ya está en uso` });

    // Validación: el profesor debe existir
    db.get('SELECT id FROM profesores WHERE id = ?', [profesorIdNum], (err, prof) => {
      if (err)  return res.status(500).json({ success: false, message: err.message });
      if (!prof) return res.status(400).json({ success: false, message: `No existe un profesor con id ${profesorIdNum}` });

      db.run(
        'INSERT INTO materias (nombre, codigo, profesorId, creditos) VALUES (?, ?, ?, ?)',
        [nombre.trim(), codigo.trim().toUpperCase(), profesorIdNum, creditosNum],
        function (err) {
          if (err) return res.status(500).json({ success: false, message: err.message });

          db.get('SELECT * FROM materias WHERE id = ?', [this.lastID], (err, nueva) => {
            res.status(201).json({
              success: true,
              message: 'Materia creada exitosamente',
              data: { ...nueva, activa: nueva.activa === 1 }
            });
          });
        }
      );
    });
  });
});

// ─── PUT /materias/:id ─────────────────────────────────────
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, codigo, profesorId, creditos, activa } = req.body;

  if (!nombre && !codigo && !profesorId && creditos === undefined && activa === undefined) {
    return res.status(400).json({ success: false, message: 'Debe enviar al menos un campo para actualizar' });
  }

  // Validaciones de tipos
  if (creditos !== undefined) {
    const creditosNum = parseInt(creditos);
    if (isNaN(creditosNum) || creditosNum <= 0) {
      return res.status(400).json({ success: false, message: 'creditos debe ser un número entero mayor a 0' });
    }
  }

  db.get('SELECT * FROM materias WHERE id = ?', [id], (err, row) => {
    if (err)  return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'Materia no encontrada' });

    // Validación: unicidad del código si cambió
    const verificarCodigo = (cb) => {
      if (!codigo || codigo === row.codigo) return cb();
      db.get('SELECT id FROM materias WHERE codigo = ? AND id != ?', [codigo, id], (err, dup) => {
        if (dup) return res.status(400).json({ success: false, message: `El código '${codigo}' ya está en uso` });
        cb();
      });
    };

    verificarCodigo(() => {
      const campos  = [];
      const valores = [];

      if (nombre     !== undefined) { campos.push('nombre = ?');     valores.push(nombre.trim()); }
      if (codigo     !== undefined) { campos.push('codigo = ?');     valores.push(codigo.trim().toUpperCase()); }
      if (profesorId !== undefined) { campos.push('profesorId = ?'); valores.push(parseInt(profesorId)); }
      if (creditos   !== undefined) { campos.push('creditos = ?');   valores.push(parseInt(creditos)); }
      if (activa     !== undefined) { campos.push('activa = ?');     valores.push(activa ? 1 : 0); }

      valores.push(id);

      db.run(`UPDATE materias SET ${campos.join(', ')} WHERE id = ?`, valores, function (err) {
        if (err) return res.status(500).json({ success: false, message: err.message });

        db.get('SELECT * FROM materias WHERE id = ?', [id], (err, actualizada) => {
          res.json({
            success: true,
            message: 'Materia actualizada',
            data: { ...actualizada, activa: actualizada.activa === 1 }
          });
        });
      });
    });
  });
});

// ─── DELETE /materias/:id ──────────────────────────────────
router.delete('/:id', (req, res) => {
  db.get('SELECT * FROM materias WHERE id = ?', [req.params.id], (err, row) => {
    if (err)  return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'Materia no encontrada' });

    db.run('DELETE FROM materias WHERE id = ?', [req.params.id], (err) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, message: 'Materia eliminada', data: { ...row, activa: row.activa === 1 } });
    });
  });
});

module.exports = router;