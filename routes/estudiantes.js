// routes/estudiantes.js — CRUD de estudiantes

const express = require('express');
const router = express.Router();
const db = require('../db');

// ─── GET todos los estudiantes ─────────────────────
router.get('/', (req, res) => {
  db.all('SELECT * FROM estudiantes ORDER BY id ASC', [], (err, rows) => {
    if (err) return res.status(500).json({ success:false, message:err.message });

    res.json({
      success:true,
      total: rows.length,
      data: rows.map(e => ({ ...e, activo: e.activo === 1 }))
    });
  });
});

// ─── GET estudiante por id ─────────────────────────
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM estudiantes WHERE id=?', [req.params.id], (err,row) => {
    if (err) return res.status(500).json({ success:false, message:err.message });

    if (!row)
      return res.status(404).json({ success:false, message:'Estudiante no encontrado' });

    res.json({
      success:true,
      data:{ ...row, activo: row.activo === 1 }
    });
  });
});

// ─── POST crear estudiante ─────────────────────────
router.post('/', (req, res) => {
  const { nombre, email, grado, edad } = req.body;

  if (!nombre || !email || !grado || !edad)
    return res.status(400).json({
      success:false,
      message:'nombre, email, grado y edad son obligatorios'
    });

  db.run(
    `INSERT INTO estudiantes (nombre, email, grado, edad)
     VALUES (?,?,?,?)`,
    [nombre, email, grado, edad],
    function(err){
      if (err)
        return res.status(500).json({ success:false, message:err.message });

      db.get('SELECT * FROM estudiantes WHERE id=?', [this.lastID], (err,nuevo) => {
        res.status(201).json({
          success:true,
          message:'Estudiante creado',
          data:{ ...nuevo, activo: nuevo.activo === 1 }
        });
      });
    }
  );
});

// ─── PUT actualizar estudiante ─────────────────────
router.put('/:id', (req, res) => {
  const { nombre, email, grado, edad, activo } = req.body;

  db.run(
    `UPDATE estudiantes SET nombre=?, email=?, grado=?, edad=?, activo=? WHERE id=?`,
    [nombre, email, grado, edad, activo ? 1:0, req.params.id],
    function(err){
      if (err)
        return res.status(500).json({ success:false, message:err.message });

      db.get('SELECT * FROM estudiantes WHERE id=?', [req.params.id], (err,actualizado) => {
        if (!actualizado)
          return res.status(404).json({ success:false, message:'Estudiante no encontrado' });

        res.json({
          success:true,
          message:'Estudiante actualizado',
          data:{ ...actualizado, activo: actualizado.activo === 1 }
        });
      });
    }
  );
});

// ─── DELETE estudiante ─────────────────────────────
router.delete('/:id', (req, res) => {
  db.get('SELECT * FROM estudiantes WHERE id=?', [req.params.id], (err,row) => {
    if (!row)
      return res.status(404).json({ success:false, message:'Estudiante no encontrado' });

    db.run('DELETE FROM estudiantes WHERE id=?', [req.params.id], err => {
      if (err)
        return res.status(500).json({ success:false, message:err.message });

      res.json({ success:true, message:'Estudiante eliminado' });
    });
  });
});

module.exports = router;
