// =============================
// CONFIGURACIÓN INICIAL
// =============================

// Carga variables del archivo .env
// Ejemplo:
// API_PASSWORD=1234
// PORT=3000
require('dotenv').config();


// Importa Express
const express = require('express');


// Crea la aplicación
const app = express();


// Importa la base de datos
const db = require('./db');


// Permite recibir datos en formato JSON
// Ejemplo:
// {
//   "nombre": "Juan"
// }
app.use(express.json());



// =============================
// MIDDLEWARE DE AUTENTICACIÓN
// =============================

// Este middleware se ejecuta antes de las rutas
// Sirve para proteger la API con contraseña
app.use((req, res, next) => {

  // Permite entrar libremente a la ruta principal "/"
  if (req.path === '/') return next();

  // Obtiene la contraseña enviada en el header
  // En Postman:
  // password: Colegio2025Seguro
  const password = req.headers['password'];

  // Verifica si no hay contraseña o es incorrecta
  if (!password || password !== process.env.API_PASSWORD) {

    // Respuesta error 401
    return res.status(401).json({
      success: false,
      message: 'No autorizado. Envía el header: password'
    });

  }

  // Si la contraseña es correcta continúa
  next();

});



// =============================
// RUTAS DEL SISTEMA
// =============================

// Cada archivo dentro de /routes
// maneja un módulo diferente

app.use('/api/estudiantes', require('./routes/estudiantes'));
app.use('/api/profesores', require('./routes/profesores'));
app.use('/api/materias', require('./routes/materias'));
app.use('/api/notas', require('./routes/notas'));
app.use('/api/cursos', require('./routes/cursos'));
app.use('/api/asistencias', require('./routes/asistencias'));
app.use('/api/horarios', require('./routes/horarios'));



// =============================
// RUTA PRINCIPAL
// =============================

// Muestra información de la API
app.get('/', (req, res) => {

  // Detecta automáticamente la URL del servidor
  const baseUrl = `${req.protocol}://${req.get('host')}`;

  res.json({

    success: true,

    message: '🏫 API REST Sistema Colegio Playon',

    autenticacion: 'Enviar header: password',

    endpoints: {

      estudiantes:  `${baseUrl}/api/estudiantes`,
      profesores:   `${baseUrl}/api/profesores`,
      materias:     `${baseUrl}/api/materias`,
      notas:        `${baseUrl}/api/notas`,
      cursos:       `${baseUrl}/api/cursos`,
      asistencias:  `${baseUrl}/api/asistencias`,
      horarios:     `${baseUrl}/api/horarios`

    }

  });

});



// =============================
// RUTA NO ENCONTRADA
// =============================

// Si la ruta no existe
app.use((req, res) => {

  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });

});



// =============================
// ERROR GLOBAL
// =============================

// Maneja errores del servidor
app.use((err, req, res, next) => {

  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });

});



// =============================
// PUERTO
// =============================

// Render usa process.env.PORT automáticamente
const PORT = process.env.PORT || 3000;



// =============================
// INICIAR SERVIDOR
// =============================

app.listen(PORT, () => {

  console.log(`🏫 API Colegio corriendo en puerto ${PORT}`);

});