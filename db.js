const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./colegio.db', (err) => {
  if (err) {
    console.error('❌ Error conectando:', err.message);
  } else {
    console.log('✅ Base de datos conectada → colegio.db');
  }
});

db.run("PRAGMA foreign_keys = ON");

db.serialize(() => {

  db.run(`CREATE TABLE IF NOT EXISTS profesores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    especialidad TEXT NOT NULL,
    activo INTEGER DEFAULT 1 CHECK(activo IN (0,1))
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS estudiantes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    grado TEXT NOT NULL,
    edad INTEGER NOT NULL CHECK(edad >= 5 AND edad <= 25),
    activo INTEGER DEFAULT 1 CHECK(activo IN (0,1))
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS materias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    codigo TEXT NOT NULL UNIQUE,
    profesorId INTEGER NOT NULL,
    creditos INTEGER NOT NULL CHECK(creditos > 0),
    activa INTEGER DEFAULT 1 CHECK(activa IN (0,1)),
    FOREIGN KEY (profesorId) REFERENCES profesores(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS cursos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    estudianteId INTEGER NOT NULL,
    materiaId INTEGER NOT NULL,
    fecha TEXT DEFAULT CURRENT_DATE,
    activo INTEGER DEFAULT 1 CHECK(activo IN (0,1)),
    FOREIGN KEY (estudianteId) REFERENCES estudiantes(id),
    FOREIGN KEY (materiaId) REFERENCES materias(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS horarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    materiaId INTEGER NOT NULL,
    dia TEXT NOT NULL CHECK(dia IN ('Lunes','Martes','Miercoles','Jueves','Viernes','Sabado')),
    hora TEXT NOT NULL,
    aula TEXT NOT NULL,
    activo INTEGER DEFAULT 1 CHECK(activo IN (0,1)),
    FOREIGN KEY (materiaId) REFERENCES materias(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS notas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    estudianteId INTEGER NOT NULL,
    materiaId INTEGER NOT NULL,
    nota REAL NOT NULL CHECK(nota >= 0.0 AND nota <= 5.0),
    periodo TEXT NOT NULL,
    fecha TEXT DEFAULT CURRENT_DATE,
    FOREIGN KEY (estudianteId) REFERENCES estudiantes(id),
    FOREIGN KEY (materiaId) REFERENCES materias(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS asistencias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    estudianteId INTEGER NOT NULL,
    materiaId INTEGER NOT NULL,
    fecha TEXT NOT NULL,
    presente INTEGER NOT NULL DEFAULT 1 CHECK(presente IN (0,1)),
    FOREIGN KEY (estudianteId) REFERENCES estudiantes(id),
    FOREIGN KEY (materiaId) REFERENCES materias(id)
  )`);

  // datos de prueba
  db.run(`INSERT OR IGNORE INTO profesores (id,nombre,email,especialidad) VALUES
    (1,'Carlos Ruiz','cruiz@colegio.com','Matematicas'),
    (2,'Laura Torres','ltorres@colegio.com','Ciencias'),
    (3,'Roberto Diaz','rdiaz@colegio.com','Historia'),
    (4,'Sandra Morales','smorales@colegio.com','Ingles')`);

  db.run(`INSERT OR IGNORE INTO estudiantes (id,nombre,email,grado,edad) VALUES
    (1,'Ana Garcia','ana@colegio.com','10A',15),
    (2,'Luis Martinez','luis@colegio.com','11B',16),
    (3,'Maria Lopez','maria@colegio.com','9C',14),
    (4,'Pedro Sanchez','pedro@colegio.com','10A',15)`);

  db.run(`INSERT OR IGNORE INTO materias (id,nombre,codigo,profesorId,creditos) VALUES
    (1,'Matematicas','MAT1',1,4),
    (2,'Ciencias','CIE1',2,3),
    (3,'Historia','HIS1',3,3),
    (4,'Ingles','ING1',4,4)`);

  db.run(`INSERT OR IGNORE INTO cursos (id,estudianteId,materiaId) VALUES
    (1,1,1),(2,1,2),(3,2,1),(4,3,3),(5,4,4)`);

  db.run(`INSERT OR IGNORE INTO horarios (id,materiaId,dia,hora,aula) VALUES
    (1,1,'Lunes','07:00','101'),
    (2,2,'Martes','08:00','102'),
    (3,3,'Miercoles','09:00','103'),
    (4,4,'Jueves','10:00','104')`);

  db.run(`INSERT OR IGNORE INTO notas (id,estudianteId,materiaId,nota,periodo) VALUES
    (1,1,1,4.5,'P1'),(2,1,2,3.8,'P1'),(3,2,1,2.9,'P1'),(4,3,3,4.0,'P1')`);

  db.run(`INSERT OR IGNORE INTO asistencias (id,estudianteId,materiaId,fecha,presente) VALUES
    (1,1,1,'2025-03-25',1),(2,1,2,'2025-03-25',1),
    (3,2,1,'2025-03-25',0),(4,3,3,'2025-03-25',1),(5,4,4,'2025-03-25',1)`);

  console.log('✅ Datos de prueba listos');
});

module.exports = db;

