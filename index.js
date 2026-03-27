// Carga variables del archivo .env (ej: contraseña, puerto)
require('dotenv').config();

// Importa el framework Express
const express = require('express');

// Crea la aplicación del servidor
const app = express();

// Importa la conexión a la base de datos (archivo db.js)
const db = require('./db');

// Permite que la API reciba datos en formato JSON
// Ejemplo: { "nombre": "Juan" }
app.use(express.json());


// =============================
// MIDDLEWARE DE AUTENTICACIÓN
// =============================

// Middleware = función que se ejecuta antes de las rutas
// Sirve para verificar la contraseña en cada petición
app.use((req, res, next) => {

  // Permite acceder libremente a la ruta principal "/"
  if (req.path === '/') return next();

  // Obtiene la contraseña enviada en el header de la petición
  // En Postman se envía como:
  // password: Colegio2025Seguro
  const password = req.headers['password'];

  // Verifica si no enviaron contraseña o si es incorrecta
  if (!password || password !== process.env.API_PASSWORD) {

    // Responde con error 401 (no autorizado)
    return res.status(401).json({
      success: false,
      message: 'No autorizado. Envía el header: password'
    });
  }

  // Si la contraseña es correcta, continúa a la ruta
  next();
});


// =============================
// RUTAS CON /api
// =============================

// Conecta las rutas desde la carpeta /routes
// Cada archivo maneja un módulo diferente del sistema

// Rutas para estudiantes
app.use('/api/estudiantes', require('./routes/estudiantes'));

// Rutas para profesores
app.use('/api/profesores', require('./routes/profesores'));

// Rutas para materias
app.use('/api/materias', require('./routes/materias'));

// Rutas para notas
app.use('/api/notas', require('./routes/notas'));

// Rutas para cursos
app.use('/api/cursos', require('./routes/cursos'));

// Rutas para asistencias
app.use('/api/asistencias', require('./routes/asistencias'));

// Rutas para horarios
app.use('/api/horarios', require('./routes/horarios'));


// =============================
// RUTA PRINCIPAL
// =============================

// Cuando alguien entra a http://localhost:3000
// la API muestra información básica
app.get('/', (req, res) => {

  res.json({
    success: true,

    // Mensaje de bienvenida
    message: '🏫 API REST Sistema Colegio Playon',

    // Explica cómo enviar la contraseña
    autenticacion: 'Envía el header: password: Colegio2025Seguro',

    // Lista de endpoints disponibles
    endpoints: {

      estudiantes:  'http://localhost:3000/api/estudiantes',
      profesores:   'http://localhost:3000/api/profesores',
      materias:     'http://localhost:3000/api/materias',
      notas:        'http://localhost:3000/api/notas',
      cursos:       'http://localhost:3000/api/cursos',
      asistencias:  'http://localhost:3000/api/asistencias',
      horarios:     'http://localhost:3000/api/horarios'
    }
  });

});


// =============================
// RUTA NO ENCONTRADA
// =============================

// Si el usuario escribe una ruta que no existe
// Ejemplo: /api/loquesea
// devuelve error 404
app.use((req, res) => {

  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });

});


// =============================
// ERROR GLOBAL
// =============================

// Maneja errores internos del servidor
// Ejemplo:
// error en la base de datos
// error en el código
app.use((err, req, res, next) => {

  // Muestra el error en la consola
  console.error(err.stack);

  // Respuesta de error 500
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });

});


// =============================
// PUERTO DEL SERVIDOR
// =============================

// Usa el puerto del .env o el 3000 por defecto
const PORT = process.env.PORT || 3000;


// =============================
// INICIAR SERVIDOR
// =============================

// Enciende la API
app.listen(PORT, () => {

  console.log(`🏫 API Colegio corriendo en http://localhost:${PORT}`);

});