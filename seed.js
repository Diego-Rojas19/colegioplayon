// =============================
// SEED — Datos de prueba
// Ejecutar: node seed.js
// =============================

const sqlite3 = require('sqlite3').verbose();
const path    = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'colegio.db'), (err) => {
  if (err) return console.error('❌ Error BD:', err.message);
  console.log('🌱 Iniciando seed...\n');
  correrSeed();
});

function correrSeed() {
  db.serialize(() => {
    db.run('PRAGMA foreign_keys = OFF');

    // ── Crear tablas si no existen ──────────────────────
    db.run(`CREATE TABLE IF NOT EXISTS estudiantes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL, email TEXT NOT NULL UNIQUE,
      grado TEXT NOT NULL, edad INTEGER NOT NULL CHECK(edad >= 5 AND edad <= 25),
      activo INTEGER NOT NULL DEFAULT 1 CHECK(activo IN (0,1)))`);

    db.run(`CREATE TABLE IF NOT EXISTS profesores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL, email TEXT NOT NULL UNIQUE,
      especialidad TEXT NOT NULL,
      activo INTEGER NOT NULL DEFAULT 1 CHECK(activo IN (0,1)))`);

    db.run(`CREATE TABLE IF NOT EXISTS materias (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL, codigo TEXT NOT NULL UNIQUE,
      profesorId INTEGER NOT NULL, creditos INTEGER NOT NULL CHECK(creditos > 0),
      activa INTEGER NOT NULL DEFAULT 1 CHECK(activa IN (0,1)),
      FOREIGN KEY(profesorId) REFERENCES profesores(id))`);

    db.run(`CREATE TABLE IF NOT EXISTS cursos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      estudianteId INTEGER NOT NULL, materiaId INTEGER NOT NULL,
      activo INTEGER NOT NULL DEFAULT 1 CHECK(activo IN (0,1)),
      FOREIGN KEY(estudianteId) REFERENCES estudiantes(id),
      FOREIGN KEY(materiaId) REFERENCES materias(id))`);

    db.run(`CREATE TABLE IF NOT EXISTS notas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      estudianteId INTEGER NOT NULL, materiaId INTEGER NOT NULL,
      nota REAL NOT NULL CHECK(nota >= 0 AND nota <= 5), periodo TEXT NOT NULL,
      FOREIGN KEY(estudianteId) REFERENCES estudiantes(id),
      FOREIGN KEY(materiaId) REFERENCES materias(id))`);

    db.run(`CREATE TABLE IF NOT EXISTS asistencias (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      estudianteId INTEGER NOT NULL, materiaId INTEGER NOT NULL,
      fecha TEXT NOT NULL, presente INTEGER NOT NULL DEFAULT 0 CHECK(presente IN (0,1)),
      FOREIGN KEY(estudianteId) REFERENCES estudiantes(id),
      FOREIGN KEY(materiaId) REFERENCES materias(id))`);

    db.run(`CREATE TABLE IF NOT EXISTS horarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      materiaId INTEGER NOT NULL, dia TEXT NOT NULL,
      hora TEXT NOT NULL, aula TEXT NOT NULL,
      activo INTEGER NOT NULL DEFAULT 1 CHECK(activo IN (0,1)),
      FOREIGN KEY(materiaId) REFERENCES materias(id))`);

    // ── Limpiar datos anteriores ────────────────────────
    db.run('DELETE FROM horarios');
    db.run('DELETE FROM asistencias');
    db.run('DELETE FROM notas');
    db.run('DELETE FROM cursos');
    db.run('DELETE FROM materias');
    db.run('DELETE FROM estudiantes');
    db.run('DELETE FROM profesores');
    db.run("DELETE FROM sqlite_sequence WHERE name IN ('horarios','asistencias','notas','cursos','materias','estudiantes','profesores')");

    // ── Profesores ──────────────────────────────────────
    db.run(`INSERT INTO profesores (nombre, email, especialidad) VALUES ('Pedro Sanchez','pedro@colegio.com','Matematicas')`);
    db.run(`INSERT INTO profesores (nombre, email, especialidad) VALUES ('Laura Torres','laura@colegio.com','Espanol')`);
    db.run(`INSERT INTO profesores (nombre, email, especialidad) VALUES ('Jorge Diaz','jorge@colegio.com','Ciencias')`);

    // ── Estudiantes ─────────────────────────────────────
    db.run(`INSERT INTO estudiantes (nombre, email, grado, edad) VALUES ('Ana Garcia','ana@colegio.com','10A',15)`);
    db.run(`INSERT INTO estudiantes (nombre, email, grado, edad) VALUES ('Luis Martinez','luis@colegio.com','10B',16)`);
    db.run(`INSERT INTO estudiantes (nombre, email, grado, edad) VALUES ('Maria Lopez','maria@colegio.com','11A',17)`);
    db.run(`INSERT INTO estudiantes (nombre, email, grado, edad) VALUES ('Carlos Ruiz','carlos@colegio.com','11B',16)`);

    // ── Materias ────────────────────────────────────────
    db.run(`INSERT INTO materias (nombre, codigo, profesorId, creditos) VALUES ('Matematicas','MAT01',1,4)`);
    db.run(`INSERT INTO materias (nombre, codigo, profesorId, creditos) VALUES ('Espanol','ESP01',2,3)`);
    db.run(`INSERT INTO materias (nombre, codigo, profesorId, creditos) VALUES ('Ciencias','CIE01',3,3)`);

    // ── Cursos ──────────────────────────────────────────
    db.run(`INSERT INTO cursos (estudianteId, materiaId) VALUES (1,1)`);
    db.run(`INSERT INTO cursos (estudianteId, materiaId) VALUES (1,2)`);
    db.run(`INSERT INTO cursos (estudianteId, materiaId) VALUES (2,1)`);
    db.run(`INSERT INTO cursos (estudianteId, materiaId) VALUES (3,3)`);
    db.run(`INSERT INTO cursos (estudianteId, materiaId) VALUES (4,2)`);

    // ── Notas ────────────────────────────────────────────
    db.run(`INSERT INTO notas (estudianteId, materiaId, nota, periodo) VALUES (1,1,4.5,'P1-2025')`);
    db.run(`INSERT INTO notas (estudianteId, materiaId, nota, periodo) VALUES (1,2,3.8,'P1-2025')`);
    db.run(`INSERT INTO notas (estudianteId, materiaId, nota, periodo) VALUES (2,1,2.5,'P1-2025')`);
    db.run(`INSERT INTO notas (estudianteId, materiaId, nota, periodo) VALUES (3,3,4.0,'P1-2025')`);
    db.run(`INSERT INTO notas (estudianteId, materiaId, nota, periodo) VALUES (4,2,3.2,'P1-2025')`);

    // ── Asistencias ──────────────────────────────────────
    db.run(`INSERT INTO asistencias (estudianteId, materiaId, fecha, presente) VALUES (1,1,'2025-03-01',1)`);
    db.run(`INSERT INTO asistencias (estudianteId, materiaId, fecha, presente) VALUES (1,1,'2025-03-02',1)`);
    db.run(`INSERT INTO asistencias (estudianteId, materiaId, fecha, presente) VALUES (2,1,'2025-03-01',0)`);
    db.run(`INSERT INTO asistencias (estudianteId, materiaId, fecha, presente) VALUES (3,3,'2025-03-01',1)`);
    db.run(`INSERT INTO asistencias (estudianteId, materiaId, fecha, presente) VALUES (4,2,'2025-03-01',1)`);

    // ── Horarios ─────────────────────────────────────────
    db.run(`INSERT INTO horarios (materiaId, dia, hora, aula) VALUES (1,'Lunes','07:00','Aula 101')`);
    db.run(`INSERT INTO horarios (materiaId, dia, hora, aula) VALUES (2,'Martes','08:00','Aula 102')`);
    db.run(`INSERT INTO horarios (materiaId, dia, hora, aula) VALUES (3,'Miercoles','09:00','Aula 103')`);

    // ── Verificar resultados ─────────────────────────────
    db.get('SELECT COUNT(*) as t FROM profesores',  [], (e,r) => console.log(`✅ Profesores:   ${r.t}`));
    db.get('SELECT COUNT(*) as t FROM estudiantes', [], (e,r) => console.log(`✅ Estudiantes:  ${r.t}`));
    db.get('SELECT COUNT(*) as t FROM materias',    [], (e,r) => console.log(`✅ Materias:     ${r.t}`));
    db.get('SELECT COUNT(*) as t FROM cursos',      [], (e,r) => console.log(`✅ Cursos:       ${r.t}`));
    db.get('SELECT COUNT(*) as t FROM notas',       [], (e,r) => console.log(`✅ Notas:        ${r.t}`));
    db.get('SELECT COUNT(*) as t FROM asistencias', [], (e,r) => console.log(`✅ Asistencias:  ${r.t}`));
    db.get('SELECT COUNT(*) as t FROM horarios',    [], (e,r) => {
      console.log(`✅ Horarios:     ${r.t}`);
      console.log('\n🎉 Seed completado exitosamente');
      db.close();
    });
  });
}