# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

# Documentación Técnica - IHC-Front

## Índice

- [Visión General](#visión-general)
- [Componentes Principales](#componentes-principales)
  - [Header](#header)
  - [CardWeek](#cardweek)
  - [DocumentUploader](#documentuploader)
- [Páginas Principales](#páginas-principales)
  - [Página Principal (`pages/index.vue`)](#página-principal)
  - [Dashboard Alumno (`pages/alumno/dashboard.vue`)](#dashboard-alumno)
  - [Cursos de Alumno (`pages/alumno/cursos/[name].vue` y `page.[details].vue`)](#cursos-de-alumno)
  - [Dashboard Profesor (`pages/profesor/dashboard.vue`)](#dashboard-profesor)
- [Composables principales](#composables-principales)
  - [useStudentCourses](#usestudentcourses)
  - [useDocumentUploader](#usedocumentuploader)
  - [useAuthUser](#useauthuser)
- [API y Lógica de Servidor](#api-y-lógica-de-servidor)
- [Configuración del Proyecto](#configuración-del-proyecto)
- [Referencias y Setup](#referencias-y-setup)

---
## Visión General

Este proyecto es una aplicación web construida con Nuxt, orientada a la gestión de clases, cursos y materiales tanto para alumnos como para profesores. Utiliza Vue 3, Pinia para el manejo de estados, Supabase para la creación y el manejo de la base de datos sumando el uso de sus funcionalidades de autenticación y una arquitectura modular moderna.

---

## Componentes Principales

### Header

- Se utiliza en la mayoría de las páginas para mostrar la navegación principal.
- Ejemplo de uso:  

  ```vue
  <Header />
  ```

### CardWeek

- Muestra información de una semana o sección de un curso.
- Permite navegar a los detalles de la semana o sección correspondiente.
- Props: `number` (Número de semana/sección).
- Ejemplo de lógica interna:  

  ```typescript
  const props = defineProps({ number: { type: Number, required: true } })
  const redirectToDetails = () => {
    let details = props.number == 1 ? 'general' : props.number - 1
    router.push(`/alumno/cursos/page.${details}`)
  }
  ```
### DocumentUploader

- Permite al usuario cargar documentos, arrastrar y soltar archivos, y gestiona el estado del archivo a subir.
- Se integra fuertemente con la lógica de composables para manejo de archivos.

---

## Páginas Principales

### Página Principal

- Archivo: `pages/index.vue`
- Muestra un mensaje de bienvenida y el componente `DocumentUploader` para cargar y transformar documentos en flashcards, tests y resúmenes mediante IA.

### Dashboard Alumno

- Archivo: `pages/alumno/dashboard.vue`
- Permite al alumno ver sus cursos, acceder a su perfil y cerrar sesión.
- Utiliza composables para obtener la lista de cursos del estudiante y gestiona la navegación entre cursos.

### Cursos de Alumno

- Archivos: 
  - `pages/alumno/cursos/[name].vue` (Lista de semanas del curso)
  - `pages/alumno/cursos/page.[details].vue` (Detalle de semana o sección)
- Permiten al alumno ver el detalle de un curso y navegar por semanas o secciones.
- Integración con componentes: `HeaderDashboard`, `CardWeek`.

### Dashboard Profesor

- Archivo: `pages/profesor/dashboard.vue`
- Permite al profesor gestionar sus clases y alumnos.
- Vista personalizada para cada usuario según su rol.

---

## Composables Principales

