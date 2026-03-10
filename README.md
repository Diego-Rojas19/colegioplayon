# 🏫 API REST - Sistema de Colegio

**Proyecto SENA – Desarrollo de APIs REST con Node.js**

Esta API permite gestionar la información de un sistema académico básico de un colegio, incluyendo estudiantes, profesores, materias y notas.

La aplicación fue desarrollada usando **Node.js, Express y SQLite** y permite realizar operaciones **CRUD completas** a través de endpoints REST.

---

# 🚀 Tecnologías utilizadas

* Node.js
* Express.js
* SQLite3
* Postman (para pruebas de API)
* draw.io (para diagrama ER)

---

# 📂 Estructura del proyecto

```
colegio-api
│
├── routes
│   ├── estudiantes.js
│   ├── profesores.js
│   ├── materias.js
│   └── notas.js
│
├── db.js
├── index.js
├── package.json
├── .gitignore
└── README.md
```

---

# 🗄️ Base de datos

La aplicación utiliza **SQLite** como base de datos local.

Archivo de base de datos:

```
colegio.db
```

---

# 📊 Diagrama ER

Aquí se muestra el diagrama de entidades y relaciones del sistema:

*(Inserta aquí la imagen exportada de draw.io)*

```
PROFESORES (1) ──── (N) MATERIAS
ESTUDIANTES (1) ─── (N) NOTAS
MATERIAS (1) ────── (N) NOTAS
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

# 🔗 Endpoints de la API

## 👨‍🏫 Profesores

| Método | Endpoint        | Descripción                  |
| ------ | --------------- | ---------------------------- |
| GET    | /profesores     | Obtener todos los profesores |
| GET    | /profesores/:id | Obtener profesor por ID      |
| POST   | /profesores     | Crear profesor               |
| PUT    | /profesores/:id | Actualizar profesor          |
| DELETE | /profesores/:id | Eliminar profesor            |

---

## 🎓 Estudiantes

| Método | Endpoint         | Descripción           |
| ------ | ---------------- | --------------------- |
| GET    | /estudiantes     | Listar estudiantes    |
| GET    | /estudiantes/:id | Obtener estudiante    |
| POST   | /estudiantes     | Crear estudiante      |
| PUT    | /estudiantes/:id | Actualizar estudiante |
| DELETE | /estudiantes/:id | Eliminar estudiante   |

---

## 📚 Materias

| Método | Endpoint      | Descripción        |
| ------ | ------------- | ------------------ |
| GET    | /materias     | Listar materias    |
| POST   | /materias     | Crear materia      |
| PUT    | /materias/:id | Actualizar materia |
| DELETE | /materias/:id | Eliminar materia   |

---

## 📝 Notas

| Método | Endpoint   | Descripción     |
| ------ | ---------- | --------------- |
| GET    | /notas     | Listar notas    |
| POST   | /notas     | Registrar nota  |
| PUT    | /notas/:id | Actualizar nota |
| DELETE | /notas/:id | Eliminar nota   |

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

3️⃣ Ejecutar el servidor

```
node index.js
```

o con nodemon

```
npm run dev
```

---

# 🧪 Pruebas de la API

Las pruebas se realizaron utilizando **Postman**, verificando:

* Casos correctos
* Validaciones de campos obligatorios
* Manejo de errores (400, 404)

---

# ❗ Manejo de errores

La API incluye validaciones para:

* Campos obligatorios
* Formato de email
* Notas entre 0.0 y 5.0
* Relaciones entre entidades
* Recursos no encontrados

---

# 👨‍💻 Autores

**Diego Quintero**
**Diego Bermudez**

Proyecto académico – SENA
Tecnología en Análisis y Desarrollo de Software
