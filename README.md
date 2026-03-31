# 🏫 API REST – Sistema Educativo Colegio Playon

Proyecto académico desarrollado para el programa **Análisis y Desarrollo de Software – SENA**.

La API permite gestionar la información académica de un colegio, incluyendo estudiantes, profesores, materias, cursos, notas, asistencias y horarios mediante operaciones **CRUD completas** siguiendo el estilo **REST**.

El sistema permite centralizar la información académica y acceder a ella desde cualquier cliente (web, móvil o Postman).

---

# 🎯 Objetivo del proyecto

Desarrollar una API REST funcional que permita administrar el sistema académico del **Colegio Playon**, aplicando:

* Diseño de base de datos relacional
* Arquitectura REST
* Validaciones de negocio
* Middleware de autenticación
* Despliegue en la nube
* Documentación técnica

---

# 🚀 Tecnologías utilizadas

| Tecnología | Uso                      |
| ---------- | ------------------------ |
| Node.js    | Entorno de ejecución     |
| Express.js | Framework backend        |
| SQLite3    | Base de datos relacional |
| dotenv     | Variables de entorno     |
| Postman    | Pruebas de endpoints     |
| GitHub     | Control de versiones     |
| Render     | Despliegue en la nube    |
| draw.io    | Diagrama ER              |

---

# 🌐 Deploy en producción

URL pública de la API:

https://colegio-api-2.onrender.com

### Endpoints principales

| Recurso     | Endpoint         |
| ----------- | ---------------- |
| Root        | /                |
| Estudiantes | /api/estudiantes |
| Profesores  | /api/profesores  |
| Materias    | /api/materias    |
| Cursos      | /api/cursos      |
| Notas       | /api/notas       |
| Horarios    | /api/horarios    |
| Asistencias | /api/asistencias |

⚠️ Todos los endpoints requieren autenticación por header.

---

# 📂 Estructura del proyecto

colegioplayon
│
├── routes
│   ├── asistencias.js
│   ├── cursos.js
│   ├── estudiantes.js
│   ├── horarios.js
│   ├── materias.js
│   ├── notas.js
│   └── profesores.js
│
├── db.js
├── index.js
├── seed.js
├── package.json
├── .env
├── .gitignore
└── README.md

---

# 🗄️ Base de datos

La aplicación utiliza SQLite como base de datos local:

colegio.db

El sistema contiene 7 tablas principales relacionadas entre sí.

---

# 📊 Modelo Entidad – Relación

Relaciones principales del sistema:

PROFESORES (1) ─── (N) MATERIAS
ESTUDIANTES (1) ─── (N) NOTAS
MATERIAS (1) ─── (N) NOTAS
ESTUDIANTES (1) ─── (N) CURSOS
MATERIAS (1) ─── (N) CURSOS
CURSOS (1) ─── (N) ASISTENCIAS
MATERIAS (1) ─── (N) HORARIOS

---

# 📚 Diccionario de datos

## profesores

| campo        | tipo    |
| ------------ | ------- |
| id           | INTEGER |
| nombre       | TEXT    |
| email        | TEXT    |
| especialidad | TEXT    |
| activo       | BOOLEAN |

---

## estudiantes

| campo  | tipo    |
| ------ | ------- |
| id     | INTEGER |
| nombre | TEXT    |
| email  | TEXT    |
| grado  | TEXT    |
| edad   | INTEGER |
| activo | BOOLEAN |

---

## materias

| campo      | tipo    |
| ---------- | ------- |
| id         | INTEGER |
| nombre     | TEXT    |
| codigo     | TEXT    |
| profesorId | INTEGER |
| creditos   | INTEGER |
| activa     | BOOLEAN |

---

## cursos

| campo        | tipo    |
| ------------ | ------- |
| id           | INTEGER |
| estudianteId | INTEGER |
| materiaId    | INTEGER |
| activo       | BOOLEAN |

---

## notas

| campo        | tipo    |
| ------------ | ------- |
| id           | INTEGER |
| estudianteId | INTEGER |
| materiaId    | INTEGER |
| nota         | REAL    |
| periodo      | TEXT    |

---

## asistencias

| campo        | tipo    |
| ------------ | ------- |
| id           | INTEGER |
| estudianteId | INTEGER |
| materiaId    | INTEGER |
| fecha        | DATE    |
| presente     | BOOLEAN |

---

## horarios

| campo      | tipo    |
| ---------- | ------- |
| id         | INTEGER |
| materiaId  | INTEGER |
| dia        | TEXT    |
| horaInicio | TEXT    |
| horaFin    | TEXT    |
| aula       | TEXT    |

---

# 🔗 Endpoints de la API

## Profesores

GET /api/profesores
GET /api/profesores/:id
POST /api/profesores
PUT /api/profesores/:id
DELETE /api/profesores/:id

---

## Estudiantes

GET /api/estudiantes
GET /api/estudiantes/:id
POST /api/estudiantes
PUT /api/estudiantes/:id
DELETE /api/estudiantes/:id

---

## Materias

GET /api/materias
GET /api/materias/:id
POST /api/materias
PUT /api/materias/:id
DELETE /api/materias/:id

---

## Cursos

GET /api/cursos
GET /api/cursos/:id
POST /api/cursos
PUT /api/cursos/:id
DELETE /api/cursos/:id

---

## Notas

GET /api/notas
GET /api/notas/:id
POST /api/notas
PUT /api/notas/:id
DELETE /api/notas/:id

---

## Horarios

GET /api/horarios
GET /api/horarios/:id
POST /api/horarios
PUT /api/horarios/:id
DELETE /api/horarios/:id

---

## Asistencias

GET /api/asistencias
GET /api/asistencias/:id
POST /api/asistencias
PUT /api/asistencias/:id
DELETE /api/asistencias/:id

---

# 🔐 Autenticación

Todos los endpoints requieren enviar el siguiente header:

password: MiPasswordSegura2024

Middleware implementado para proteger todas las rutas excepto la raíz.

---

# ⚙️ Instalación del proyecto

1. Clonar repositorio

git clone https://github.com/Diego-Rojas19/colegioplayon.git

2. Instalar dependencias

npm install

3. Configurar archivo .env

PORT=3000
API_PASSWORD=MiPasswordSegura2024
NODE_ENV=production

4. Ejecutar proyecto

node index.js

modo desarrollo:

npm run dev

---

# 🧪 Pruebas de la API

Las pruebas fueron realizadas con Postman verificando:

* endpoints CRUD
* validaciones de datos
* autenticación
* manejo de errores
* filtros dinámicos

---

# ❗ Validaciones implementadas

* email único en estudiantes y profesores
* nota entre 0 y 5
* edad entre 5 y 25
* presente solo 0 o 1
* existencia de llaves foráneas
* campos obligatorios
* filtros dinámicos en GET
* autenticación por middleware

---

# ☁️ Despliegue en Render

Configuración:

Build Command:
npm install

Start Command:
node seed.js && node index.js

Variables de entorno:

API_PASSWORD=MiPasswordSegura2024
NODE_ENV=production

---

# 👨‍💻 Autor

Diego Andres Rojas Quintero

Proyecto Final – SENA
Tecnología en Análisis y Desarrollo de Software
