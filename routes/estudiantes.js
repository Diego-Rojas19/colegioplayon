const express = require('express');
const router = express.Router();

// ─── Base de datos simulada ────────────────────────────────
let estudiantes = [
  { id: 1, nombre: 'Ana García',    email: 'ana@colegio.com',   grado: '10A', edad: 15, activo: true },
  { id: 2, nombre: 'Luis Martínez', email: 'luis@colegio.com',  grado: '11B', edad: 16, activo: true },
  { id: 3, nombre: 'María López',   email: 'maria@colegio.com', grado: '9C',  edad: 14, activo: true },
  { id: 4, nombre: 'Pedro Sánchez', email: 'pedro@colegio.com', grado: '10A', edad: 15, activo: false },
];
let nextId = 5;

// ─── GET /estudiantes ──────────────────────────────────────
// Soporta filtros: ?nombre=Ana&grado=10A&activo=true
// Lee header: accept-language (idioma del cliente)
router.get('/', (req, res) => {
  const idioma   = req.headers['accept-language'] || 'es';
  const filtros  = req.query;

  let resultado = [...estudiantes];

  if (Object.keys(filtros).length > 0) {
    resultado = resultado.filter(e =>
      Object.entries(filtros).every(([k, v]) =>
        e[k]?.toString().toLowerCase().includes(v.toLowerCase())
      )
    );
  }

  res.json({
    success: true,
    total: resultado.length,
    idioma_cliente: idioma,
    data: resultado
  });
});

// ─── GET /estudiantes/:id ──────────────────────────────────
router.get('/:id', (req, res) => {
  const estudiante = estudiantes.find(e => e.id === parseInt(req.params.id));
  if (!estudiante) {
    return res.status(404).json({ success: false, message: 'Estudiante no encontrado' });
  }
  res.json({ success: true, data: estudiante });
});

// ─── POST /estudiantes ─────────────────────────────────────
router.post('/', (req, res) => {
  const { nombre, email, grado, edad } = req.body;

  if (!nombre || !email || !grado || !edad) {
    return res.status(400).json({
      success: false,
      message: 'Campos requeridos: nombre, email, grado, edad'
    });
  }

  const nuevo = { id: nextId++, nombre, email, grado, edad: parseInt(edad), activo: true };
  estudiantes.push(nuevo);

  res.status(201).json({ success: true, message: 'Estudiante creado exitosamente', data: nuevo });
});

// ─── PUT /estudiantes/:id ──────────────────────────────────
router.put('/:id', (req, res) => {
  const idx = estudiantes.findIndex(e => e.id === parseInt(req.params.id));
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Estudiante no encontrado' });
  }

  const { nombre, email, grado, edad, activo } = req.body;
  if (!nombre && !email && !grado && !edad && activo === undefined) {
    return res.status(400).json({ success: false, message: 'Debe enviar al menos un campo para actualizar' });
  }

  estudiantes[idx] = {
    ...estudiantes[idx],
    ...(nombre  !== undefined && { nombre }),
    ...(email   !== undefined && { email }),
    ...(grado   !== undefined && { grado }),
    ...(edad    !== undefined && { edad: parseInt(edad) }),
    ...(activo  !== undefined && { activo: activo === 'false' ? false : Boolean(activo) }),
  };

  res.json({ success: true, message: 'Estudiante actualizado', data: estudiantes[idx] });
});

// ─── DELETE /estudiantes/:id ───────────────────────────────
router.delete('/:id', (req, res) => {
  const idx = estudiantes.findIndex(e => e.id === parseInt(req.params.id));
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Estudiante no encontrado' });
  }

  const eliminado = estudiantes.splice(idx, 1)[0];
  res.json({ success: true, message: 'Estudiante eliminado', data: eliminado });
});

module.exports = router;
