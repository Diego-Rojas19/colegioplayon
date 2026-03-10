// db.js — Conexión a SQLite y creación de tablas del sistema del colegio

const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./colegio.db', (err) => {
  if (err) console.error('❌ Error conectando a la base de datos:', err.message);
  else console.log('✅ Base de datos conectada → colegio.db');
});

// Activar llaves foráneas
db.run('PRAGMA foreign_keys = ON');

db.serialize(() => {

  // ─────────────────────────────────────────────
  // TABLA: profesores
  // ─────────────────────────────────────────────
  db.run(`
    CREATE TABLE IF NOT EXISTS profesores (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre       TEXT    NOT NULL,
      email        TEXT    NOT NULL UNIQUE,
      especialidad TEXT    NOT NULL,
      activo       INTEGER DEFAULT 1 CHECK(activo IN (0,1))
    )
  `, (err) => {
    if (err) console.error('Error creando tabla profesores:', err.message);
    else console.log('✅ Tabla profesores lista');
  });

  // ─────────────────────────────────────────────
  // TABLA: estudiantes
  // ─────────────────────────────────────────────
  db.run(`
    CREATE TABLE IF NOT EXISTS estudiantes (
      id     INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT    NOT NULL,
      email  TEXT    NOT NULL UNIQUE,
      grado  TEXT    NOT NULL,
      edad   INTEGER NOT NULL CHECK(edad >= 5 AND edad <= 25),
      activo INTEGER DEFAULT 1 CHECK(activo IN (0,1))
    )
  `, (err) => {
    if (err) console.error('Error creando tabla estudiantes:', err.message);
    else console.log('✅ Tabla estudiantes lista');
  });

  // ─────────────────────────────────────────────
  // TABLA: materias
  // FK: profesorId → profesores.id
  // ─────────────────────────────────────────────
  db.run(`
    CREATE TABLE IF NOT EXISTS materias (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre     TEXT    NOT NULL,
      codigo     TEXT    NOT NULL UNIQUE,
      profesorId INTEGER NOT NULL,
      creditos   INTEGER NOT NULL CHECK(creditos > 0),
      activa     INTEGER DEFAULT 1 CHECK(activa IN (0,1)),
      FOREIGN KEY (profesorId) REFERENCES profesores(id)
    )
  `, (err) => {
    if (err) console.error('Error creando tabla materias:', err.message);
    else console.log('✅ Tabla materias lista');
  });

  // ─────────────────────────────────────────────
  // TABLA: notas
  // FK: estudianteId → estudiantes.id
  // FK: materiaId   → materias.id
  // ─────────────────────────────────────────────
  db.run(`
    CREATE TABLE IF NOT EXISTS notas (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      estudianteId INTEGER NOT NULL,
      materiaId    INTEGER NOT NULL,
      nota         REAL    NOT NULL CHECK(nota >= 0.0 AND nota <= 5.0),
      periodo      TEXT    NOT NULL,
      fecha        TEXT    DEFAULT (date('now')),
      FOREIGN KEY (estudianteId) REFERENCES estudiantes(id),
      FOREIGN KEY (materiaId)    REFERENCES materias(id)
    )
  `, (err) => {
    if (err) console.error('Error creando tabla notas:', err.message);
    else console.log('✅ Tabla notas lista');
  });

  // ─────────────────────────────────────────────
  // DATOS DE PRUEBA (solo si las tablas están vacías)
  // ─────────────────────────────────────────────
  db.get('SELECT COUNT(*) as total FROM profesores', (err, row) => {
    if (err || row.total > 0) return;

    console.log('📦 Insertando datos de prueba...');

    db.run(`INSERT INTO profesores (nombre, email, especialidad) VALUES
      ('Carlos Ruiz',    'cruiz@colegio.com',    'Matemáticas'),
      ('Laura Torres',   'ltorres@colegio.com',  'Ciencias'),
      ('Roberto Díaz',   'rdiaz@colegio.com',    'Historia'),
      ('Sandra Morales', 'smorales@colegio.com', 'Inglés')`);

    db.run(`INSERT INTO estudiantes (nombre, email, grado, edad) VALUES
      ('Ana García',    'ana@colegio.com',   '10A', 15),
      ('Luis Martínez', 'luis@colegio.com',  '11B', 16),
      ('María López',   'maria@colegio.com', '9C',  14),
      ('Pedro Sánchez', 'pedro@colegio.com', '10A', 15)`);

    db.run(`INSERT INTO materias (nombre, codigo, profesorId, creditos) VALUES
      ('Matemáticas',        'MAT-01', 1, 4),
      ('Ciencias Naturales', 'CIE-01', 2, 3),
      ('Historia',           'HIS-01', 3, 3),
      ('Inglés',             'ING-01', 4, 4)`);

    db.run(`INSERT INTO notas (estudianteId, materiaId, nota, periodo) VALUES
      (1, 1, 4.5, 'P1-2025'),
      (1, 2, 3.8, 'P1-2025'),
      (2, 1, 2.9, 'P1-2025'),
      (3, 3, 4.0, 'P1-2025')`);

    console.log('✅ Datos de prueba insertados');
  });

});

module.exports = db;