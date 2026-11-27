# Sistema de Control de Biblioteca Universitaria – Web

## Descripción

Aplicación web desarrollada para administrar y consultar los recursos de una biblioteca universitaria. Permite a los usuarios registrarse, iniciar sesión, consultar el catálogo de libros y solicitar préstamos. Además, cuenta con funcionalidades administrativas para gestionar libros, usuarios y devoluciones.

## Tecnologías utilizadas

- React
- JavaScript
- Vite
- React Router DOM
- CSS
- API REST
- Git y GitHub

## Funcionalidades

### Usuarios
- Registro de nuevos usuarios.
- Inicio y cierre de sesión.
- Validación de formularios.
- Consulta del catálogo de libros.
- Búsqueda y consulta de información de libros.
- Solicitud de préstamos.
- Consulta de préstamos personales.

### Administradores
- Consulta del panel administrativo.
- Registro y edición de libros.
- Administración de usuarios.
- Actualización de roles y estados de usuarios.
- Consulta de préstamos.
- Registro de devoluciones y observaciones.

## Requisitos previos

- Node.js
- npm
- Navegador web moderno.

## Instalación

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/carlostellez11/biblioteca-web.git
   ```

2. Entrar al directorio:

   ```bash
   cd biblioteca-web
   ```

3. Instalar las dependencias:

   ```bash
   npm install
   ```

4. Crear un archivo `.env` en la raíz del proyecto tomando como referencia `.env.example`.

5. Configurar las variables de entorno:

   ```env
   VITE_API_BASE_URL=https://proyecto-idgs9-v1.onrender.com
   VITE_API_APP_TOKEN=TU_TOKEN_DE_API
   ```

   Sustituir `TU_TOKEN_DE_API` por el token proporcionado para consumir la API. No compartir ni subir el archivo `.env` al repositorio.

## Ejecución en desarrollo

Iniciar el servidor local:

```bash
npm run dev
```

Vite mostrará la dirección local para acceder a la aplicación desde el navegador.

## Compilación para producción

Para generar la versión de producción:

```bash
npm run build
```

Para comprobar localmente la compilación:

```bash
npm run preview
```

## Estructura del proyecto

```text
biblioteca-web/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   └── RutaProtegida.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── Admin.jsx
│   │   ├── Admin.css
│   │   ├── AdminLibros.jsx
│   │   ├── AdminLibros.css
│   │   ├── AdminPrestamos.jsx
│   │   ├── AdminPrestamos.css
│   │   ├── AdminUsuarios.jsx
│   │   ├── AdminUsuarios.css
│   │   ├── Catalogo.jsx
│   │   ├── Catalogo.css
│   │   ├── Login.jsx
│   │   ├── Login.css
│   │   ├── Registro.jsx
│   │   ├── Registro.css
│   │   ├── SolicitudPrestamo.jsx
│   │   ├── SolicitudPrestamo.css
│   │   ├── MisPrestamos.jsx
│   │   └── MisPrestamos.css
│   ├── services/
│   │   ├── api.js
│   │   └── authService.js
│   ├── utils/
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env.example
├── index.html
├── package.json
└── README.md   
```

## API

La aplicación consume una API REST compartida con la versión móvil del sistema.

Documentación de los endpoints:

https://proyecto-idgs9-v1.onrender.com/api/docs/

Las peticiones utilizan el encabezado `x-api-token` y, para operaciones autenticadas, el token JWT del usuario.

## Seguridad

- Autenticación mediante tokens JWT.
- Protección de rutas según el estado de autenticación y los permisos del usuario.
- Control de acceso para usuarios y administradores.
- Variables de entorno para la configuración de la conexión con la API.
- Gestión de sesión y cierre de sesión.

## Despliegue

La aplicación se encuentra publicada en Render y puede
consultarse mediante el siguiente enlace:

https://biblioteca-web-kdgz.onrender.com

La aplicación utiliza variables de entorno para conectarse
con la API REST.

## Repositorio

https://github.com/carlostellez11/biblioteca-web