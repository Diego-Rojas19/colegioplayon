// =============================
// CONFIGURACIÓN DE BASE DE DATOS
// =============================

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Nombre del archivo de la base de datos
const db_name = path.join(__dirname, 'colegio.db');

// Conexión a la base de datos
const db = new sqlite3.Database(db_name, (err) => {
  if (err) {
    console.error('❌ Error al abrir la base de datos:', err.message);
  } else {
    console.log('✅ Base de datos conectada en', db_name);
  }
});

// =============================
// CREACIÓN DE TABLAS
// =============================

db.serialize(() => {
  // Tabla estudiantes (sin AUTOINCREMENT para permitir IDs manuales)
  db.run(`CREATE TABLE IF NOT EXISTS estudiantes (
    id INTEGER PRIMARY KEY,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    grado TEXT NOT NULL,
    edad INTEGER NOT NULL CHECK(edad >= 5 AND edad <= 25),
    activo INTEGER DEFAULT 1 CHECK(activo IN (0,1))
  )`);

  // Tabla profesores
  db.run(`CREATE TABLE IF NOT EXISTS profesores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    especialidad TEXT NOT NULL
  )`);

  // Tabla materias
  db.run(`CREATE TABLE IF NOT EXISTS materias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    descripcion TEXT
  )`);

  // Tabla cursos
  db.run(`CREATE TABLE IF NOT EXISTS cursos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    grado TEXT NOT NULL
  )`);

  // Tabla notas
  db.run(`CREATE TABLE IF NOT EXISTS notas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    estudiante_id INTEGER NOT NULL,
    materia_id INTEGER NOT NULL,
    nota REAL NOT NULL CHECK(nota >= 0 AND nota <= 5),
    FOREIGN KEY(estudiante_id) REFERENCES estudiantes(id),
    FOREIGN KEY(materia_id) REFERENCES materias(id)
  )`);

  // Tabla asistencias
  db.run(`CREATE TABLE IF NOT EXISTS asistencias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    estudiante_id INTEGER NOT NULL,
    materia_id INTEGER NOT NULL,
    fecha TEXT NOT NULL,
    FOREIGN KEY(estudiante_id) REFERENCES estudiantes(id),
    FOREIGN KEY(materia_id) REFERENCES materias(id)
  )`);

  // Tabla horarios
  db.run(`CREATE TABLE IF NOT EXISTS horarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    curso_id INTEGER NOT NULL,
    materia_id INTEGER NOT NULL,
    profesor_id INTEGER NOT NULL,
    dia TEXT NOT NULL,
    hora TEXT NOT NULL,
    FOREIGN KEY(curso_id) REFERENCES cursos(id),
    FOREIGN KEY(materia_id) REFERENCES materias(id),
    FOREIGN KEY(profesor_id) REFERENCES profesores(id)
  )`);
});

// =============================
// EXPORTAR CONEXIÓN
// =============================
module.exports = db;
