# ISW_New_CEE

Sistema Web para la Gestión del Centro de Estudiantes

## Descripción General

ISW_New_CEE es una aplicación web desarrollada como proyecto de Ingeniería de Software, orientada a la gestión integral de un centro de estudiantes. Permite la administración de usuarios, actividades, votaciones, documentos y más, facilitando la comunicación y organización dentro de la comunidad estudiantil.

El proyecto utiliza el stack PERN (PostgreSQL, Express.js, React, Node.js) para ofrecer una solución robusta, escalable y moderna.

---

## Tabla de Contenidos
- [Características Principales](#características-principales)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación y Configuración](#instalación-y-configuración)
- [Buenas Prácticas Implementadas](#buenas-prácticas-implementadas)
- [Autores](#autores)

---

## Características Principales
- Autenticación y autorización de usuarios (Passport.js)
- Gestión de usuarios (CRUD)
- Registro y administración de actividades
- Gestión de asistencia y votaciones
- Administración de documentos
- Notificaciones y mensajes al usuario
- Validaciones avanzadas en formularios
- Manejo amigable de errores
- Interfaz moderna y responsiva (React)

---

## Tecnologías Utilizadas
- **Frontend:** React.js, Vite
- **Backend:** Node.js, Express.js
- **Base de Datos:** PostgreSQL
- **ORM:** Sequelize (si aplica)
- **Autenticación:** Passport.js
- **Estilos:** CSS, librerías de componentes (ej: Material UI, Bootstrap, etc.)
- **Herramientas adicionales:** SweetAlert, DBeaver (opcional para gestión de BD)

---

## Estructura del Proyecto

```
ISW_New_CEE/
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── entity/
│   │   ├── handlers/
│   │   ├── helpers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── validations/
│   │   └── index.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── helpers/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   └── main.jsx
│   └── package.json
└── README.md
```

---

## Instalación y Configuración

### Prerrequisitos
- Node.js (v20.x.x LTS)
- Git (v2.45.2 o superior)
- PostgreSQL (v16.x.x)
- DBeaver (opcional)

### Clonación del Repositorio
```bash
git clone https://github.com/AshCrow13/ISW_New_CEE.git
cd ISW_New_CEE
```

### Configuración del Backend
```bash
cd backend
cp src/config/.env.example src/config/.env
# Edita el archivo .env con tus credenciales de BD
npm install
npm run dev
```

### Configuración del Frontend
```bash
cd frontend
cp .env.example .env
# Edita el archivo .env si es necesario
npm install
npm run dev
```

### Configuración de la Base de Datos
- Crea la base de datos en PostgreSQL según lo definido en el archivo `.env`.
- (Opcional) Usa DBeaver para administrar y visualizar la base de datos.

---

## Buenas Prácticas Implementadas
- Formato adecuado de fechas, horas y campos numéricos
- Visualización de descripciones en vez de IDs
- Uso de selects para claves foráneas
- Validaciones exhaustivas en formularios (campos requeridos, formatos, máscaras, etc.)
- Manejo amigable de errores y notificaciones al usuario
- Captura automática de fechas, horas y estados
- Listados ordenados y con opciones de búsqueda/filtro
- Subida y optimización de archivos (validación de tipo y tamaño)
- Interfaz consistente y sin faltas de ortografía

---

## Autores
- [AshCrow13](https://github.com/AshCrow13)
- [Chitopan26](https://github.com/Chitopan26)
- [Etrius](https://github.com/Etriuus)
- Integrantes del equipo ISW 2025-1

---

## Licencia
Este proyecto está bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.
