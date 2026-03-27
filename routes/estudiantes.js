// routes/cursos.js — CRUD de cursos

const express = require('express');
const router = express.Router();
const db = require('../db');

// ─── GET todos los cursos ─────────────────────
router.get('/', (req, res) => {
  db.all('SELECT * FROM cursos ORDER BY id ASC', [], (err, rows) => {
    if (err) return res.status(500).json({ success:false, message:err.message });

    res.json({
      success:true,
      total: rows.length,
      data: rows.map(c => ({ ...c, activo: c.activo === 1 }))
    });
  });
});

// ─── GET curso por id ─────────────────────────
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM cursos WHERE id=?', [req.params.id], (err,row) => {

    if (err) return res.status(500).json({ success:false, message:err.message });

    if (!row)
      return res.status(404).json({
        success:false,
        message:'Curso no encontrado'
      });

    res.json({
      success:true,
      data:{ ...row, activo: row.activo === 1 }
    });

  });
});

// ─── POST crear curso ─────────────────────────
router.post('/', (req, res) => {

  const { estudianteId, materiaId } = req.body;

  if (!estudianteId || !materiaId)
    return res.status(400).json({
      success:false,
      message:'estudianteId y materiaId son obligatorios'
    });

  db.run(
    `INSERT INTO cursos (estudianteId, materiaId)
     VALUES (?,?)`,
    [estudianteId, materiaId],
    function(err){

      if (err)
        return res.status(500).json({
          success:false,
          message:err.message
        });

      db.get('SELECT * FROM cursos WHERE id=?',
      [this.lastID],
      (err,nuevo)=>{

        res.status(201).json({
          success:true,
          message:'Curso creado',
          data:{ ...nuevo, activo: nuevo.activo === 1 }
        });

      });

    });

});

// ─── PUT actualizar curso ─────────────────────
router.put('/:id', (req, res) => {

  const { activo } = req.body;

  db.get('SELECT * FROM cursos WHERE id=?',
  [req.params.id],
  (err,row)=>{

    if (!row)
      return res.status(404).json({
        success:false,
        message:'Curso no encontrado'
      });

    db.run(
      'UPDATE cursos SET activo=? WHERE id=?',
      [activo ? 1:0, req.params.id],
      function(err){

        if (err)
          return res.status(500).json({
            success:false,
            message:err.message
          });

        db.get(
          'SELECT * FROM cursos WHERE id=?',
          [req.params.id],
          (err,actualizado)=>{

            res.json({
              success:true,
              message:'Curso actualizado',
              data:{ ...actualizado, activo: actualizado.activo === 1 }
            });

          });

      });

  });

});

// ─── DELETE curso ─────────────────────────────
router.delete('/:id', (req, res) => {

  db.get(
    'SELECT * FROM cursos WHERE id=?',
    [req.params.id],
    (err,row)=>{

      if (!row)
        return res.status(404).json({
          success:false,
          message:'Curso no encontrado'
        });

      db.run(
        'DELETE FROM cursos WHERE id=?',
        [req.params.id],
        err=>{

          res.json({
            success:true,
            message:'Curso eliminado'
          });

        });

    });

});

module.exports = router;