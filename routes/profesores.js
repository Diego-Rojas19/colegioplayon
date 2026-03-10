// routes/profesores.js — CRUD de profesores con SQLite y validaciones

const express = require('express');
const router  = express.Router();
const db      = require('../db');

// ─── GET /profesores ───────────────────────────────────────
// Filtros opcionales: ?nombre=Carlos&especialidad=Matemáticas&activo=1
// Header: authorization
router.get('/', (req, res) => {
  const token = req.headers['authorization'] || 'No provisto';

  // Construir filtros dinámicos
  const condiciones = [];
  const valores     = [];

  if (req.query.nombre) {
    condiciones.push("nombre LIKE ?");
    valores.push(`%${req.query.nombre}%`);
  }
  if (req.query.especialidad) {
    condiciones.push("especialidad LIKE ?");
    valores.push(`%${req.query.especialidad}%`);
  }
  if (req.query.activo !== undefined) {
    condiciones.push("activo = ?");
    valores.push(req.query.activo === 'true' ? 1 : 0);
  }

  const where = condiciones.length > 0 ? `WHERE ${condiciones.join(' AND ')}` : '';
  const sql   = `SELECT * FROM profesores ${where} ORDER BY id ASC`;

  db.all(sql, valores, (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: err.message });

    res.json({
      success: true,
      total: rows.length,
      token_recibido: token,
      data: rows.map(p => ({ ...p, activo: p.activo === 1 }))
    });
  });
});

// ─── GET /profesores/:id ───────────────────────────────────
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM profesores WHERE id = ?', [req.params.id], (err, row) => {
    if (err)  return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'Profesor no encontrado' });

    res.json({ success: true, data: { ...row, activo: row.activo === 1 } });
  });
});

// ─── POST /profesores ──────────────────────────────────────
router.post('/', (req, res) => {
  const { nombre, email, especialidad } = req.body;

  // Validación: campos obligatorios
  if (!nombre || !email || !especialidad) {
    return res.status(400).json({
      success: false,
      message: 'Campos requeridos: nombre, email, especialidad'
    });
  }

  // Validación: formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'El email no tiene un formato válido' });
  }

  // Validación: unicidad del email
  db.get('SELECT id FROM profesores WHERE email = ?', [email], (err, row) => {
    if (err)  return res.status(500).json({ success: false, message: err.message });
    if (row)  return res.status(400).json({ success: false, message: 'El email ya está registrado' });

    db.run(
      'INSERT INTO profesores (nombre, email, especialidad) VALUES (?, ?, ?)',
      [nombre.trim(), email.trim().toLowerCase(), especialidad.trim()],
      function (err) {
        if (err) return res.status(500).json({ success: false, message: err.message });

        db.get('SELECT * FROM profesores WHERE id = ?', [this.lastID], (err, nuevo) => {
          res.status(201).json({
            success: true,
            message: 'Profesor creado exitosamente',
            data: { ...nuevo, activo: nuevo.activo === 1 }
          });
        });
      }
    );
  });
});

// ─── PUT /profesores/:id ───────────────────────────────────
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, email, especialidad, activo } = req.body;

  if (!nombre && !email && !especialidad && activo === undefined) {
    return res.status(400).json({ success: false, message: 'Debe enviar al menos un campo para actualizar' });
  }

  // Verificar que existe
  db.get('SELECT * FROM profesores WHERE id = ?', [id], (err, row) => {
    if (err)  return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'Profesor no encontrado' });

    // Validación: formato de email si se envía
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: 'El email no tiene un formato válido' });
      }
    }

    // Validación: unicidad del email si cambió
    const verificarEmail = (cb) => {
      if (!email || email === row.email) return cb();
      db.get('SELECT id FROM profesores WHERE email = ? AND id != ?', [email, id], (err, dup) => {
        if (dup) return res.status(400).json({ success: false, message: 'El email ya está en uso por otro profesor' });
        cb();
      });
    };

    verificarEmail(() => {
      const campos  = [];
      const valores = [];

      if (nombre       !== undefined) { campos.push('nombre = ?');       valores.push(nombre.trim()); }
      if (email        !== undefined) { campos.push('email = ?');        valores.push(email.trim().toLowerCase()); }
      if (especialidad !== undefined) { campos.push('especialidad = ?'); valores.push(especialidad.trim()); }
      if (activo       !== undefined) { campos.push('activo = ?');       valores.push(activo ? 1 : 0); }

      valores.push(id);

      db.run(`UPDATE profesores SET ${campos.join(', ')} WHERE id = ?`, valores, function (err) {
        if (err) return res.status(500).json({ success: false, message: err.message });

        db.get('SELECT * FROM profesores WHERE id = ?', [id], (err, actualizado) => {
          res.json({
            success: true,
            message: 'Profesor actualizado',
            data: { ...actualizado, activo: actualizado.activo === 1 }
          });
        });
      });
    });
  });
});

// ─── DELETE /profesores/:id ────────────────────────────────
router.delete('/:id', (req, res) => {
  db.get('SELECT * FROM profesores WHERE id = ?', [req.params.id], (err, row) => {
    if (err)  return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'Profesor no encontrado' });

    db.run('DELETE FROM profesores WHERE id = ?', [req.params.id], (err) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, message: 'Profesor eliminado', data: { ...row, activo: row.activo === 1 } });
    });
  });
});

module.exports = router;