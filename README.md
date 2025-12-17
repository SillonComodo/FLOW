# Flow - Requisitos de instalación

## Software previo

- Node.js 18 LTS o superior (incluye npm).
- Navegador para completar el flujo OAuth de Google al primer arranque.

## Dependencias npm

Desde la carpeta `aplicacion/` ejecutar:

```bash
npm install
```

El comando instala todo lo declarado en `package.json`, incluyendo:

- `react` y `react-dom`
- `lucide-react`
- `react-markdown`
- `@google-cloud/local-auth` y `googleapis`
- `electron`
- `vite` y `@vitejs/plugin-react`
- `typescript`
- `concurrently`, `wait-on` y `cross-env`

## Credenciales necesarias

- Archivo `token.json` de Google OAuth (cliente tipo Desktop) junto al `package.json`.
- Archivo `.env.local` con `OPENAI_API_KEY=tu-clave`.

### Imagen ilustrativa
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

---

# Flow: entorno académico para la carrera

Flow es un espacio de trabajo integral para estudiantes universitarios que combina panel de control, gestor de pendientes, herramientas de estudio con IA y flujos de automatización sobre una aplicación de escritorio intuitiva.

## Herramientas implementadas

- **Dashboard**: resumen rápido de tareas pendientes, prioridades y productividad. Desde aquí puedes saltar al Workspace o al gestor de pendientes con un clic.
- **Gestión de pendientes**: sincroniza tareas desde Google Classroom, permite crearlas manualmente, filtrarlas por estado y abrir cada tarea para generar o continuar un plan de proyecto.
- **Workspace inteligente** (núcleo del proyecto):
  - Editor asistido por IA para notas y código, con chat contextual.
  - Conversor de PDF a texto y visor integrado (usa PDF.js vía CDN).
  - Conversor a LaTeX para entregar reportes con formato académico.
  - Generador de quizzes de estudio a partir de tus apuntes.
  - Planificador de estudio con bloques de tiempo y envío opcional a Google Calendar.
  - Planificador de proyectos con checklist autogenerada y continuidad en modo ejecución (seguimiento, notas, archivos y chat).
- **Correo**: redacción guiada de correos académicos pensada para integrarse con un flujo N8N (actualmente simulado desde la UI).
- **Configuración**: administra la sesión de Google (Classroom + Calendar), revisa el estado de las credenciales y ejecuta logout seguro.

## Instalación y ejecución

```bash
git clone <url-del-repo>
cd prueba_APP/aplicacion
npm install
# Copia token.json y crea .env.local según se describe arriba
npm run dev
```

El comando `npm run dev` levanta Vite (renderer) y Electron en paralelo. La aplicación abrirá una ventana de escritorio en cuanto el dev server esté disponible.

### Scripts disponibles

| Script             | Descripción                                                                 |
|--------------------|-----------------------------------------------------------------------------|
| `npm run dev`      | Ejecuta renderer + Electron con recarga en caliente.                        |
| `npm run renderer` | Ejecuta solo el renderer de Vite (útil para depurar UI).                    |
| `npm run electron` | Arranca únicamente la ventana de Electron consumiendo el servidor ya levantado. |
| `npm run build`    | Genera el bundle de producción (`dist/`).                                   |
| `npm run preview`  | Sirve la compilación de Vite para ver el renderer sin Electron.             |

> Nota: Para distribuir como escritorio necesitarás un empaquetador (ej. electron-builder). Actualmente, el proyecto está listo para desarrollo y pruebas internas.

## Persistencia local

- **Tokens Google**: `classroom_token.json` (junto a `package.json`). Incluye access/refresh tokens; nunca lo subas al repositorio.
- **Planes de proyecto**: `project_plans.json` dentro de la ruta `userData` de Electron (p.ej. `%APPDATA%/Flow/`). También se mantiene un respaldo en `localStorage` del renderer.
- **Historial de actividades Workspace**: `localStorage` bajo las claves `unidevos.savedActivities` y `unidevos.projectPlans` para recuperación rápida.

## Estructura relevante

- `electron/`: proceso principal (ventana, autenticación Google, persistencia filesystem).
- `pages/`: vistas principales (Dashboard, Tasks, Workspace, Mail, Config).
- `components/Sidebar.tsx`: navegación lateral adaptativa.
- `services/`: conectores (`classroomService`, `geminiService/openAIService`).
- `types.ts`: modelos compartidos entre vistas.
- `vite.config.ts`: alias, variables de entorno y puerto del dev server.

---

Con esta guía tienes todo lo necesario para clonar, instalar y ejecutar Flow sin sobresaltos.