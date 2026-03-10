// routes/estudiantes.js — CRUD de estudiantes con SQLite y validaciones

const express = require('express');
const router  = express.Router();
const db      = require('../db');

// ─── GET /estudiantes ──────────────────────────────────────
// Filtros: ?nombre=Ana&grado=10A&activo=true
// Header: accept-language
router.get('/', (req, res) => {
  const idioma = req.headers['accept-language'] || 'es';

  const condiciones = [];
  const valores     = [];

  if (req.query.nombre) {
    condiciones.push("nombre LIKE ?");
    valores.push(`%${req.query.nombre}%`);
  }
  if (req.query.grado) {
    condiciones.push("grado LIKE ?");
    valores.push(`%${req.query.grado}%`);
  }
  if (req.query.activo !== undefined) {
    condiciones.push("activo = ?");
    valores.push(req.query.activo === 'true' ? 1 : 0);
  }

  const where = condiciones.length > 0 ? `WHERE ${condiciones.join(' AND ')}` : '';
  const sql   = `SELECT * FROM estudiantes ${where} ORDER BY id ASC`;

  db.all(sql, valores, (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: err.message });

    res.json({
      success: true,
      total: rows.length,
      idioma_cliente: idioma,
      data: rows.map(e => ({ ...e, activo: e.activo === 1 }))
    });
  });
});

// ─── GET /estudiantes/:id ──────────────────────────────────
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM estudiantes WHERE id = ?', [req.params.id], (err, row) => {
    if (err)  return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'Estudiante no encontrado' });

    res.json({ success: true, data: { ...row, activo: row.activo === 1 } });
  });
});

// ─── POST /estudiantes ─────────────────────────────────────
router.post('/', (req, res) => {
  const { nombre, email, grado, edad } = req.body;

  // Validación: campos obligatorios
  if (!nombre || !email || !grado || edad === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Campos requeridos: nombre, email, grado, edad'
    });
  }

  // Validación: formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'El email no tiene un formato válido' });
  }

  // Validación: edad debe ser número entero entre 5 y 25
  const edadNum = parseInt(edad);
  if (isNaN(edadNum) || edadNum < 5 || edadNum > 25) {
    return res.status(400).json({ success: false, message: 'La edad debe ser un número entero entre 5 y 25' });
  }

  // Validación: unicidad del email
  db.get('SELECT id FROM estudiantes WHERE email = ?', [email], (err, row) => {
    if (err)  return res.status(500).json({ success: false, message: err.message });
    if (row)  return res.status(400).json({ success: false, message: 'El email ya está registrado' });

    db.run(
      'INSERT INTO estudiantes (nombre, email, grado, edad) VALUES (?, ?, ?, ?)',
      [nombre.trim(), email.trim().toLowerCase(), grado.trim(), edadNum],
      function (err) {
        if (err) return res.status(500).json({ success: false, message: err.message });

        db.get('SELECT * FROM estudiantes WHERE id = ?', [this.lastID], (err, nuevo) => {
          res.status(201).json({
            success: true,
            message: 'Estudiante creado exitosamente',
            data: { ...nuevo, activo: nuevo.activo === 1 }
          });
        });
      }
    );
  });
});

// ─── PUT /estudiantes/:id ──────────────────────────────────
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, email, grado, edad, activo } = req.body;

  if (!nombre && !email && !grado && edad === undefined && activo === undefined) {
    return res.status(400).json({ success: false, message: 'Debe enviar al menos un campo para actualizar' });
  }

  // Validación: edad si se envía
  if (edad !== undefined) {
    const edadNum = parseInt(edad);
    if (isNaN(edadNum) || edadNum < 5 || edadNum > 25) {
      return res.status(400).json({ success: false, message: 'La edad debe ser un número entero entre 5 y 25' });
    }
  }

  // Verificar que existe
  db.get('SELECT * FROM estudiantes WHERE id = ?', [id], (err, row) => {
    if (err)  return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'Estudiante no encontrado' });

    // Validación: unicidad del email si cambió
    const verificarEmail = (cb) => {
      if (!email || email === row.email) return cb();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: 'El email no tiene un formato válido' });
      }
      db.get('SELECT id FROM estudiantes WHERE email = ? AND id != ?', [email, id], (err, dup) => {
        if (dup) return res.status(400).json({ success: false, message: 'El email ya está en uso por otro estudiante' });
        cb();
      });
    };

    verificarEmail(() => {
      const campos  = [];
      const valores = [];

      if (nombre !== undefined) { campos.push('nombre = ?'); valores.push(nombre.trim()); }
      if (email  !== undefined) { campos.push('email = ?');  valores.push(email.trim().toLowerCase()); }
      if (grado  !== undefined) { campos.push('grado = ?');  valores.push(grado.trim()); }
      if (edad   !== undefined) { campos.push('edad = ?');   valores.push(parseInt(edad)); }
      if (activo !== undefined) { campos.push('activo = ?'); valores.push(activo ? 1 : 0); }

      valores.push(id);

      db.run(`UPDATE estudiantes SET ${campos.join(', ')} WHERE id = ?`, valores, function (err) {
        if (err) return res.status(500).json({ success: false, message: err.message });

        db.get('SELECT * FROM estudiantes WHERE id = ?', [id], (err, actualizado) => {
          res.json({
            success: true,
            message: 'Estudiante actualizado',
            data: { ...actualizado, activo: actualizado.activo === 1 }
          });
        });
      });
    });
  });
});

// ─── DELETE /estudiantes/:id ───────────────────────────────
router.delete('/:id', (req, res) => {
  db.get('SELECT * FROM estudiantes WHERE id = ?', [req.params.id], (err, row) => {
    if (err)  return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'Estudiante no encontrado' });

    db.run('DELETE FROM estudiantes WHERE id = ?', [req.params.id], (err) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, message: 'Estudiante eliminado', data: { ...row, activo: row.activo === 1 } });
    });
  });
});

module.exports = router;