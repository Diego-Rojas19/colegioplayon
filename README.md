# 🏫 API REST - Sistema de Colegio

**Proyecto SENA – Desarrollo de APIs REST con Node.js**

Esta API permite gestionar la información de un sistema académico básico de un colegio, incluyendo estudiantes, profesores, materias, notas, cursos, horarios y asistencias.

La aplicación fue desarrollada usando **Node.js, Express y SQLite** y permite realizar operaciones **CRUD completas** a través de endpoints REST.

---

# 🚀 Tecnologías utilizadas

* Node.js
* Express.js
* SQLite3
* Postman (para pruebas de API)
* draw.io (para diagrama ER)
* Render (para despliegue en la nube)

---

# 🌐 Deploy en Render

La API está desplegada y disponible públicamente en:

```
https://colegio-api-2.onrender.com
```

### Endpoints en producción

| Recurso      | URL                                                    |
| ------------ | ------------------------------------------------------ |
| Raíz         | https://colegio-api-2.onrender.com                     |
| Estudiantes  | https://colegio-api-2.onrender.com/api/estudiantes     |
| Profesores   | https://colegio-api-2.onrender.com/api/profesores      |
| Materias     | https://colegio-api-2.onrender.com/api/materias        |
| Notas        | https://colegio-api-2.onrender.com/api/notas           |
| Cursos       | https://colegio-api-2.onrender.com/api/cursos          |
| Horarios     | https://colegio-api-2.onrender.com/api/horarios        |
| Asistencias  | https://colegio-api-2.onrender.com/api/asistencias     |

> ⚠️ Todos los endpoints requieren el header `password: MiPasswordSegura2024`

---

# 📂 Estructura del proyecto

```
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
├── package.json
├── .env
├── .gitignore
└── README.md
```

---

# 🗄️ Base de datos

La aplicación utiliza **SQLite** como base de datos local.

```
colegio.db
```

---

# 📊 Diagrama ER

```
PROFESORES (1) ──── (N) MATERIAS
ESTUDIANTES (1) ─── (N) NOTAS
MATERIAS (1) ────── (N) NOTAS
ESTUDIANTES (1) ─── (N) CURSOS
MATERIAS (1) ────── (N) CURSOS
CURSOS (1) ─────── (N) ASISTENCIAS
MATERIAS (1) ────── (N) HORARIOS
```

---

# 📚 Diccionario de datos

## Tabla: profesores

| Campo        | Tipo    | Descripción                       |
| ------------ | ------- | --------------------------------- |
| id           | INTEGER | Identificador único del profesor  |
| nombre       | TEXT    | Nombre completo                   |
| email        | TEXT    | Correo electrónico único          |
| especialidad | TEXT    | Área de enseñanza                 |
| activo       | BOOLEAN | Indica si el profesor está activo |

---

## Tabla: estudiantes

| Campo  | Tipo    | Descripción                  |
| ------ | ------- | ---------------------------- |
| id     | INTEGER | Identificador del estudiante |
| nombre | TEXT    | Nombre completo              |
| email  | TEXT    | Correo electrónico único     |
| grado  | TEXT    | Grado académico              |
| edad   | INTEGER | Edad del estudiante          |
| activo | BOOLEAN | Estado del estudiante        |

---

## Tabla: materias

| Campo      | Tipo    | Descripción                     |
| ---------- | ------- | ------------------------------- |
| id         | INTEGER | Identificador de la materia     |
| nombre     | TEXT    | Nombre de la materia            |
| codigo     | TEXT    | Código único de la materia      |
| profesorId | INTEGER | Profesor que imparte la materia |
| creditos   | INTEGER | Número de créditos              |
| activa     | BOOLEAN | Estado de la materia            |

---

## Tabla: notas

| Campo        | Tipo    | Descripción                 |
| ------------ | ------- | --------------------------- |
| id           | INTEGER | Identificador de la nota    |
| estudianteId | INTEGER | Estudiante al que pertenece |
| materiaId    | INTEGER | Materia evaluada            |
| nota         | REAL    | Calificación (0.0 - 5.0)    |
| periodo      | TEXT    | Periodo académico           |
| fecha        | DATE    | Fecha de registro           |

---

## Tabla: cursos

| Campo        | Tipo    | Descripción                        |
| ------------ | ------- | ---------------------------------- |
| id           | INTEGER | Identificador del curso            |
| estudianteId | INTEGER | Estudiante inscrito                |
| materiaId    | INTEGER | Materia en la que está inscrito    |
| fecha        | DATE    | Fecha de inscripción               |
| activo       | BOOLEAN | Estado de la inscripción           |

---

## Tabla: horarios

| Campo     | Tipo    | Descripción                  |
| --------- | ------- | ---------------------------- |
| id        | INTEGER | Identificador del horario    |
| materiaId | INTEGER | Materia asociada             |
| dia       | TEXT    | Día de la semana             |
| horaInicio| TEXT    | Hora de inicio               |
| horaFin   | TEXT    | Hora de finalización         |
| aula      | TEXT    | Aula asignada                |

---

## Tabla: asistencias

| Campo        | Tipo    | Descripción                      |
| ------------ | ------- | -------------------------------- |
| id           | INTEGER | Identificador de la asistencia   |
| estudianteId | INTEGER | Estudiante                       |
| materiaId    | INTEGER | Materia                          |
| fecha        | DATE    | Fecha de la clase                |
| presente     | BOOLEAN | Si asistió (1) o no (0)          |

---

# 🔗 Endpoints de la API

## 👨‍🏫 Profesores

| Método | Endpoint            | Descripción                  |
| ------ | ------------------- | ---------------------------- |
| GET    | /api/profesores     | Obtener todos los profesores |
| GET    | /api/profesores/:id | Obtener profesor por ID      |
| POST   | /api/profesores     | Crear profesor               |
| PUT    | /api/profesores/:id | Actualizar profesor          |
| DELETE | /api/profesores/:id | Eliminar profesor            |

---

## 🎓 Estudiantes

| Método | Endpoint             | Descripción           |
| ------ | -------------------- | --------------------- |
| GET    | /api/estudiantes     | Listar estudiantes    |
| GET    | /api/estudiantes/:id | Obtener estudiante    |
| POST   | /api/estudiantes     | Crear estudiante      |
| PUT    | /api/estudiantes/:id | Actualizar estudiante |
| DELETE | /api/estudiantes/:id | Eliminar estudiante   |

---

## 📚 Materias

| Método | Endpoint          | Descripción        |
| ------ | ----------------- | ------------------ |
| GET    | /api/materias     | Listar materias    |
| GET    | /api/materias/:id | Obtener materia    |
| POST   | /api/materias     | Crear materia      |
| PUT    | /api/materias/:id | Actualizar materia |
| DELETE | /api/materias/:id | Eliminar materia   |

---

## 📝 Notas

| Método | Endpoint       | Descripción     |
| ------ | -------------- | --------------- |
| GET    | /api/notas     | Listar notas    |
| GET    | /api/notas/:id | Obtener nota    |
| POST   | /api/notas     | Registrar nota  |
| PUT    | /api/notas/:id | Actualizar nota |
| DELETE | /api/notas/:id | Eliminar nota   |

---

## 🗂️ Cursos

| Método | Endpoint        | Descripción          |
| ------ | --------------- | -------------------- |
| GET    | /api/cursos     | Listar cursos        |
| GET    | /api/cursos/:id | Obtener curso por ID |
| POST   | /api/cursos     | Crear curso          |
| PUT    | /api/cursos/:id | Actualizar curso     |
| DELETE | /api/cursos/:id | Eliminar curso       |

---

## 🕐 Horarios

| Método | Endpoint          | Descripción          |
| ------ | ----------------- | -------------------- |
| GET    | /api/horarios     | Listar horarios      |
| GET    | /api/horarios/:id | Obtener horario      |
| POST   | /api/horarios     | Crear horario        |
| PUT    | /api/horarios/:id | Actualizar horario   |
| DELETE | /api/horarios/:id | Eliminar horario     |

---

## ✅ Asistencias

| Método | Endpoint             | Descripción             |
| ------ | -------------------- | ----------------------- |
| GET    | /api/asistencias     | Listar asistencias      |
| GET    | /api/asistencias/:id | Obtener asistencia      |
| POST   | /api/asistencias     | Registrar asistencia    |
| PUT    | /api/asistencias/:id | Actualizar asistencia   |
| DELETE | /api/asistencias/:id | Eliminar asistencia     |

---

# ⚙️ Instalación del proyecto

1️⃣ Clonar el repositorio

```
git clone https://github.com/tuusuario/colegio-api.git
```

2️⃣ Instalar dependencias

```
npm install
```

3️⃣ Configurar el archivo `.env`

```
PORT=3000
API_PASSWORD=MiPasswordSegura2024
NODE_ENV=production
```

4️⃣ Ejecutar el servidor

```
node index.js
```

o con nodemon

```
npm run dev
```

---

# 🔐 Autenticación

Todos los endpoints están protegidos. Se debe enviar el siguiente header en cada petición:

```
password: MiPasswordSegura2024
```

---

# 🧪 Pruebas de la API

Las pruebas se realizaron utilizando **Postman**, verificando:

* Casos correctos
* Validaciones de campos obligatorios
* Manejo de errores (400, 404, 401)

---

# ❗ Manejo de errores

La API incluye validaciones para:

* Autenticación por header
* Campos obligatorios
* Formato de email
* Notas entre 0.0 y 5.0
* Relaciones entre entidades (FK)
* Recursos no encontrados

---

# 👨‍💻 Autor

**Diego Rojas**

Proyecto académico – SENA  
Tecnología en Análisis y Desarrollo de Software