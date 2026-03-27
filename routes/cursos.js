const express = require('express');
const router = express.Router();
const db = require('../db');

// GET todos — filtro dinámico
router.get('/', (req, res) => {
  const keys = Object.keys(req.query);
  let query = 'SELECT * FROM cursos';
  let params = [];
  if (keys.length > 0) {
    query += ' WHERE ' + keys.map(k => `${k} = ?`).join(' AND ');
    params = Object.values(req.query);
  }
  query += ' ORDER BY id ASC';
  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, total: rows.length, data: rows });
  });
});

// GET por id
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM cursos WHERE id=?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'Curso no encontrado' });
    res.json({ success: true, data: row });
  });
});

// POST crear — valida FK
router.post('/', (req, res) => {
  const { estudianteId, materiaId } = req.body;

  if (!estudianteId || !materiaId)
    return res.status(400).json({ success: false, message: 'estudianteId y materiaId son obligatorios' });

  if (isNaN(estudianteId) || isNaN(materiaId))
    return res.status(400).json({ success: false, message: 'estudianteId y materiaId deben ser números' });

  // verificar que el estudiante existe
  db.get('SELECT id FROM estudiantes WHERE id=?', [estudianteId], (err, est) => {
    if (!est) return res.status(400).json({ success: false, message: `No existe un estudiante con id ${estudianteId}` });

    // verificar que la materia existe
    db.get('SELECT id FROM materias WHERE id=?', [materiaId], (err, mat) => {
      if (!mat) return res.status(400).json({ success: false, message: `No existe una materia con id ${materiaId}` });

      db.run('INSERT INTO cursos (estudianteId, materiaId) VALUES (?,?)', [estudianteId, materiaId], function(err) {
        if (err) return res.status(500).json({ success: false, message: err.message });
        db.get('SELECT * FROM cursos WHERE id=?', [this.lastID], (err, nuevo) => {
          res.status(201).json({ success: true, message: 'Curso creado', data: nuevo });
        });
      });
    });
  });
});

// PUT actualizar
router.put('/:id', (req, res) => {
  const { activo } = req.body;
  if (activo === undefined)
    return res.status(400).json({ success: false, message: 'El campo activo es obligatorio' });

  db.get('SELECT * FROM cursos WHERE id=?', [req.params.id], (err, row) => {
    if (!row) return res.status(404).json({ success: false, message: 'Curso no encontrado' });
    db.run('UPDATE cursos SET activo=? WHERE id=?', [activo ? 1 : 0, req.params.id], function(err) {
      if (err) return res.status(500).json({ success: false, message: err.message });
      db.get('SELECT * FROM cursos WHERE id=?', [req.params.id], (err, actualizado) => {
        res.json({ success: true, message: 'Curso actualizado', data: actualizado });
      });
    });
  });
});

// DELETE
router.delete('/:id', (req, res) => {
  db.get('SELECT * FROM cursos WHERE id=?', [req.params.id], (err, row) => {
    if (!row) return res.status(404).json({ success: false, message: 'Curso no encontrado' });
    db.run('DELETE FROM cursos WHERE id=?', [req.params.id], err => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, message: 'Curso eliminado' });
    });
  });
});

module.exports = router;