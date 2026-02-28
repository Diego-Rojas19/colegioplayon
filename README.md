# 🏫 API REST – Sistema de Colegio | SENA Proyecto 5
integrandes 
- Diego Andres Rojas Quintero
-Diego Bermudez

API REST desarrollada con Node.js y Express.js como parte de la actividad del SENA.  
Implementa CRUD completo para las entidades: **Estudiantes, Profesores, Materias y Notas**.

## 🚀 Instalación y ejecución

```bash
npm install
npm start
```

La API correrá en: `http://localhost:3000`

---

## 📋 Endpoints

### 👩‍🎓 Estudiantes – `/estudiantes`

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/estudiantes` | Lista todos (soporta filtros por query) |
| GET | `/estudiantes/:id` | Busca por ID |
| POST | `/estudiantes` | Crea un nuevo estudiante |
| PUT | `/estudiantes/:id` | Actualiza un estudiante |
| DELETE | `/estudiantes/:id` | Elimina un estudiante |

**Campos:** `id`, `nombre`, `email`, `grado`, `edad`, `activo`

**Query params disponibles:** `?nombre=Ana&grado=10A&activo=true`  
**Header leído:** `Accept-Language` → devuelto en la respuesta como `idioma_cliente`

**Ejemplo POST body:**
```json
{
  "nombre": "Camila Torres",
  "email": "camila@colegio.com",
  "grado": "10B",
  "edad": 15
}
```

---

### 👨‍🏫 Profesores – `/profesores`

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/profesores` | Lista todos (soporta filtros por query) |
| GET | `/profesores/:id` | Busca por ID |
| POST | `/profesores` | Crea un nuevo profesor |
| PUT | `/profesores/:id` | Actualiza un profesor |
| DELETE | `/profesores/:id` | Elimina un profesor |

**Campos:** `id`, `nombre`, `email`, `especialidad`, `activo`

**Query params disponibles:** `?especialidad=Matematicas&activo=true`  
**Header leído:** `Authorization` → devuelto en la respuesta como `token_recibido`

**Ejemplo POST body:**
```json
{
  "nombre": "Isabel Vargas",
  "email": "ivargas@colegio.com",
  "especialidad": "Física"
}
```

---

### 📚 Materias – `/materias`

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/materias` | Lista todas (soporta filtros por query) |
| GET | `/materias/:id` | Busca por ID |
| POST | `/materias` | Crea una nueva materia |
| PUT | `/materias/:id` | Actualiza una materia |
| DELETE | `/materias/:id` | Elimina una materia |

**Campos:** `id`, `nombre`, `codigo`, `profesorId`, `creditos`, `activa`

**Query params disponibles:** `?nombre=Ingles&activa=true`  
**Header leído:** `x-grado` → devuelto en la respuesta como `grado_consultante`

**Ejemplo POST body:**
```json
{
  "nombre": "Educación Física",
  "codigo": "EF-01",
  "profesorId": 2,
  "creditos": 2
}
```

---

### 📝 Notas – `/notas`

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/notas` | Lista todas (soporta filtros por query) |
| GET | `/notas/:id` | Busca por ID |
| POST | `/notas` | Registra una nueva nota |
| PUT | `/notas/:id` | Actualiza una nota existente |
| DELETE | `/notas/:id` | Elimina una nota |

**Campos:** `id`, `estudianteId`, `materiaId`, `nota` (0.0–5.0), `periodo`, `fecha`

**Query params disponibles:** `?estudianteId=1&periodo=P1-2025`  
**Header leído:** `x-rol` (admin | profesor | estudiante) → filtra resultados según rol

**Ejemplo POST body:**
```json
{
  "estudianteId": 1,
  "materiaId": 3,
  "nota": 4.2,
  "periodo": "P1-2025"
}
```

---

## 📦 Estructura de respuestas

**Éxito:**
```json
{ "success": true, "data": { ... } }
```

**Error:**
```json
{ "success": false, "message": "Descripción del error" }
```

## 🔢 Códigos de estado HTTP

| Código | Uso |
|--------|-----|
| 200 | Consulta o actualización exitosa |
| 201 | Recurso creado correctamente |
| 400 | Datos incompletos o inválidos |
| 404 | Recurso no encontrado |

---

## 🗂️ Estructura del proyecto

```
colegio-api/
├── index.js
├── package.json
├── README.md
└── routes/
    ├── estudiantes.js
    ├── profesores.js
    ├── materias.js
    └── notas.js
```
