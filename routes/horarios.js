const express = require('express');
const router = express.Router();
const db = require('../db');

const diasValidos = ['Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'];

// GET todos — filtro dinámico
router.get('/', (req, res) => {
  const keys = Object.keys(req.query);
  let query = 'SELECT * FROM horarios';
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
  db.get('SELECT * FROM horarios WHERE id=?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'Horario no encontrado' });
    res.json({ success: true, data: row });
  });
});

// POST crear — valida FK y dia
router.post('/', (req, res) => {
  const { materiaId, dia, hora, aula } = req.body;

  if (!materiaId || !dia || !hora || !aula)
    return res.status(400).json({ success: false, message: 'materiaId, dia, hora y aula son obligatorios' });

  if (isNaN(materiaId))
    return res.status(400).json({ success: false, message: 'materiaId debe ser un número' });

  if (!diasValidos.includes(dia))
    return res.status(400).json({ success: false, message: `dia debe ser uno de: ${diasValidos.join(', ')}` });

  db.get('SELECT id FROM materias WHERE id=?', [materiaId], (err, mat) => {
    if (!mat) return res.status(400).json({ success: false, message: `No existe una materia con id ${materiaId}` });

    db.run('INSERT INTO horarios (materiaId, dia, hora, aula) VALUES (?,?,?,?)', [materiaId, dia, hora, aula], function(err) {
      if (err) return res.status(500).json({ success: false, message: err.message });
      db.get('SELECT * FROM horarios WHERE id=?', [this.lastID], (err, nuevo) => {
        res.status(201).json({ success: true, message: 'Horario creado', data: nuevo });
      });
    });
  });
});

// PUT actualizar
router.put('/:id', (req, res) => {
  const { dia, hora, aula, activo } = req.body;

  if (!dia && !hora && !aula && activo === undefined)
    return res.status(400).json({ success: false, message: 'Debe enviar al menos un campo para actualizar' });

  if (dia && !diasValidos.includes(dia))
    return res.status(400).json({ success: false, message: `dia debe ser uno de: ${diasValidos.join(', ')}` });

  db.get('SELECT * FROM horarios WHERE id=?', [req.params.id], (err, row) => {
    if (!row) return res.status(404).json({ success: false, message: 'Horario no encontrado' });
    db.run(
      'UPDATE horarios SET dia=?, hora=?, aula=?, activo=? WHERE id=?',
      [dia || row.dia, hora || row.hora, aula || row.aula, activo !== undefined ? (activo ? 1 : 0) : row.activo, req.params.id],
      function(err) {
        if (err) return res.status(500).json({ success: false, message: err.message });
        db.get('SELECT * FROM horarios WHERE id=?', [req.params.id], (err, actualizado) => {
          res.json({ success: true, message: 'Horario actualizado', data: actualizado });
        });
      }
    );
  });
});

// DELETE
router.delete('/:id', (req, res) => {
  db.get('SELECT * FROM horarios WHERE id=?', [req.params.id], (err, row) => {
    if (!row) return res.status(404).json({ success: false, message: 'Horario no encontrado' });
    db.run('DELETE FROM horarios WHERE id=?', [req.params.id], err => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, message: 'Horario eliminado' });
    });
  });
});

module.exports = router;