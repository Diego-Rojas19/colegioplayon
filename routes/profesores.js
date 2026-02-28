const express = require('express');
const router = express.Router();

// ─── Base de datos simulada ────────────────────────────────
let profesores = [
  { id: 1, nombre: 'Carlos Ruiz',    email: 'cruiz@colegio.com',   especialidad: 'Matemáticas', activo: true },
  { id: 2, nombre: 'Laura Torres',   email: 'ltorres@colegio.com', especialidad: 'Ciencias',    activo: true },
  { id: 3, nombre: 'Roberto Díaz',   email: 'rdiaz@colegio.com',   especialidad: 'Historia',    activo: true },
  { id: 4, nombre: 'Sandra Morales', email: 'smorales@colegio.com',especialidad: 'Inglés',      activo: false },
];
let nextId = 5;

// ─── GET /profesores ───────────────────────────────────────
// Filtros: ?nombre=Carlos&especialidad=Matemáticas
// Header: authorization (token del sistema)
router.get('/', (req, res) => {
  const token  = req.headers['authorization'] || 'No provisto';
  const filtros = req.query;

  let resultado = [...profesores];

  if (Object.keys(filtros).length > 0) {
    resultado = resultado.filter(p =>
      Object.entries(filtros).every(([k, v]) =>
        p[k]?.toString().toLowerCase().includes(v.toLowerCase())
      )
    );
  }

  res.json({
    success: true,
    total: resultado.length,
    token_recibido: token,
    data: resultado
  });
});

// ─── GET /profesores/:id ───────────────────────────────────
router.get('/:id', (req, res) => {
  const profesor = profesores.find(p => p.id === parseInt(req.params.id));
  if (!profesor) {
    return res.status(404).json({ success: false, message: 'Profesor no encontrado' });
  }
  res.json({ success: true, data: profesor });
});

// ─── POST /profesores ──────────────────────────────────────
router.post('/', (req, res) => {
  const { nombre, email, especialidad } = req.body;

  if (!nombre || !email || !especialidad) {
    return res.status(400).json({
      success: false,
      message: 'Campos requeridos: nombre, email, especialidad'
    });
  }

  const nuevo = { id: nextId++, nombre, email, especialidad, activo: true };
  profesores.push(nuevo);

  res.status(201).json({ success: true, message: 'Profesor creado exitosamente', data: nuevo });
});

// ─── PUT /profesores/:id ───────────────────────────────────
router.put('/:id', (req, res) => {
  const idx = profesores.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Profesor no encontrado' });
  }

  const { nombre, email, especialidad, activo } = req.body;
  if (!nombre && !email && !especialidad && activo === undefined) {
    return res.status(400).json({ success: false, message: 'Debe enviar al menos un campo para actualizar' });
  }

  profesores[idx] = {
    ...profesores[idx],
    ...(nombre       !== undefined && { nombre }),
    ...(email        !== undefined && { email }),
    ...(especialidad !== undefined && { especialidad }),
    ...(activo       !== undefined && { activo: activo === 'false' ? false : Boolean(activo) }),
  };

  res.json({ success: true, message: 'Profesor actualizado', data: profesores[idx] });
});

// ─── DELETE /profesores/:id ────────────────────────────────
router.delete('/:id', (req, res) => {
  const idx = profesores.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Profesor no encontrado' });
  }

  const eliminado = profesores.splice(idx, 1)[0];
  res.json({ success: true, message: 'Profesor eliminado', data: eliminado });
});

module.exports = router;
