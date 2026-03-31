const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db_name = path.join(__dirname, 'colegio.db');

const db = new sqlite3.Database(db_name, (err) => {
  if (err) {
    console.error(' Error al abrir la base de datos:', err.message);
  } else {
    console.log(' Base de datos conectada en', db_name);
  }
});

db.serialize(() => {
  db.run('PRAGMA foreign_keys = ON');

  // ── Estudiantes ──────────────────────────────────────────
  db.run(`CREATE TABLE IF NOT EXISTS estudiantes (
    id     INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT    NOT NULL,
    email  TEXT    NOT NULL UNIQUE,
    grado  TEXT    NOT NULL,
    edad   INTEGER NOT NULL CHECK(edad >= 5 AND edad <= 25),
    activo INTEGER NOT NULL DEFAULT 1 CHECK(activo IN (0,1))
  )`);

  // ── Profesores ───────────────────────────────────────────
  db.run(`CREATE TABLE IF NOT EXISTS profesores (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre       TEXT    NOT NULL,
    email        TEXT    NOT NULL UNIQUE,
    especialidad TEXT    NOT NULL,
    activo       INTEGER NOT NULL DEFAULT 1 CHECK(activo IN (0,1))
  )`);

  // ── Materias ─────────────────────────────────────────────
  db.run(`CREATE TABLE IF NOT EXISTS materias (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre     TEXT    NOT NULL,
    codigo     TEXT    NOT NULL UNIQUE,
    profesorId INTEGER NOT NULL,
    creditos   INTEGER NOT NULL CHECK(creditos > 0),
    activa     INTEGER NOT NULL DEFAULT 1 CHECK(activa IN (0,1)),
    FOREIGN KEY(profesorId) REFERENCES profesores(id)
  )`);

  // ── Cursos ───────────────────────────────────────────────
  db.run(`CREATE TABLE IF NOT EXISTS cursos (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    estudianteId INTEGER NOT NULL,
    materiaId    INTEGER NOT NULL,
    activo       INTEGER NOT NULL DEFAULT 1 CHECK(activo IN (0,1)),
    FOREIGN KEY(estudianteId) REFERENCES estudiantes(id),
    FOREIGN KEY(materiaId)    REFERENCES materias(id)
  )`);

  // ── Notas ────────────────────────────────────────────────
  db.run(`CREATE TABLE IF NOT EXISTS notas (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    estudianteId INTEGER NOT NULL,
    materiaId    INTEGER NOT NULL,
    nota         REAL    NOT NULL CHECK(nota >= 0 AND nota <= 5),
    periodo      TEXT    NOT NULL,
    FOREIGN KEY(estudianteId) REFERENCES estudiantes(id),
    FOREIGN KEY(materiaId)    REFERENCES materias(id)
  )`);

  // ── Asistencias ──────────────────────────────────────────
  db.run(`CREATE TABLE IF NOT EXISTS asistencias (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    estudianteId INTEGER NOT NULL,
    materiaId    INTEGER NOT NULL,
    fecha        TEXT    NOT NULL,
    presente     INTEGER NOT NULL DEFAULT 0 CHECK(presente IN (0,1)),
    FOREIGN KEY(estudianteId) REFERENCES estudiantes(id),
    FOREIGN KEY(materiaId)    REFERENCES materias(id)
  )`);

  // ── Horarios ─────────────────────────────────────────────
  db.run(`CREATE TABLE IF NOT EXISTS horarios (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    materiaId INTEGER NOT NULL,
    dia       TEXT    NOT NULL,
    hora      TEXT    NOT NULL,
    aula      TEXT    NOT NULL,
    activo    INTEGER NOT NULL DEFAULT 1 CHECK(activo IN (0,1)),
    FOREIGN KEY(materiaId) REFERENCES materias(id)
  )`);
});

module.exports = db;