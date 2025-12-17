<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Flow: entorno acad�mico para la carrera

Flow es un espacio de trabajo integral para estudiantes universitarios que combina panel de control, gestor de pendientes, herramientas de estudio con IA y flujos de automatizaci�n sobre una app de escritorio construida con Electron + Vite + React.

## Herramientas implementadas

- **Dashboard**: resumen r�pido de tareas pendientes, prioridades y productividad. Desde aqu� puedes saltar al Workspace o al gestor de pendientes con un clic.
- **Gesti�n de pendientes**: sincroniza tareas desde Google Classroom, permite crearlas manualmente, filtrarlas por estado y abrir cada tarea para generar o continuar un plan de proyecto.
- **Workspace inteligente** (n�cleo del proyecto):
  - Editor asistido por IA para notas y c�digo, con chat contextual.
  - Conversor de PDF a texto y visor integrado (usa PDF.js v�a CDN).
  - Conversor a LaTeX para entregar reportes con formato acad�mico.
  - Generador de quizzes de estudio a partir de tus apuntes.
  - Planificador de estudio con bloques de tiempo y env�o opcional a Google Calendar.
  - Planificador de proyectos con checklist autogenerada y continuidad en modo ejecuci�n (seguimiento, notas, archivos y chat).
- **Correo**: redacci�n guiada de correos acad�micos pensada para integrarse con un flujo N8N (actualmente simulado desde la UI).
- **Configuraci�n**: administra la sesi�n de Google (Classroom + Calendar), revisa el estado de las credenciales y ejecuta logout seguro.

## Integraciones y dependencias clave

- **Google Classroom** y **Google Calendar** por medio de googleapis y @google-cloud/local-auth dentro del proceso principal de Electron. Los tokens de acceso renovados se guardan en classroom_token.json y nunca deben versionarse.
- **OpenAI (GPT-4o mini)** para el asistente, res�menes, conversi�n LaTeX, quizzes y planes de proyecto. El SDK se implementa v�a llamadas REST, por lo que solo necesitas tu clave en .env.local (OPENAI_API_KEY).
- **PDF.js** se carga din�micamente desde CDN para extraer texto y renderizar PDFs sin depender de dependencias nativas adicionales.
- **N8N / APIs externas**: el m�dulo de correo est� listo para conectarse a un webhook o flujo automatizado. Actualmente la acci�n de env�o est� simulada, pero la UI, estados y validaciones est�n implementados.

### Dependencias de tiempo de ejecuci�n

- 
eact y 
eact-dom: UI declarativa.
- lucide-react: iconograf�a ligera y moderna.
- 
eact-markdown: renderizado de planes y respuestas en formato Markdown.
- @google-cloud/local-auth y googleapis: autenticaci�n OAuth 2.0 y consumo de Classroom/Calendar.

### Dependencias de desarrollo y build

- electron: empaquetado desktop con preload seguro.
- ite + @vitejs/plugin-react: bundler ultrarr�pido para el renderer.
- 	ypescript: tipado est�tico.
- concurrently, wait-on, cross-env: orquestaci�n de procesos (renderer + Electron) en tiempo de desarrollo.

Todas se instalan autom�ticamente con 
pm install y se definen en package.json.

## Requisitos previos

1. **Node.js 18 o superior** (se recomienda la versi�n LTS vigente).
2. **Cuenta de Google Cloud** con los APIs de Classroom y Calendar habilitados.
3. **Credenciales OAuth 2.0** tipo "Aplicaci�n de escritorio" descargadas como 	oken.json.
4. **Clave de OpenAI** con acceso al modelo GPT-4o mini (variable OPENAI_API_KEY).
5. Conexi�n a internet para cargar PDF.js desde CDN y consumir las APIs mencionadas.

## Configuraci�n de credenciales

### Google Classroom + Calendar

1. En Google Cloud Console crea un proyecto (o selecciona uno existente) y habilita las APIs **Classroom** y **Calendar**.
2. Dentro de *APIs & Services ? Credentials* crea una credencial **OAuth client ID** tipo **Desktop app**.
3. Descarga el JSON y gu�rdalo como 	oken.json en:
   - plicacion/token.json (junto al package.json), o
   - prueba_APP/token.json (nivel superior). El proceso de Electron buscar� en ambos lugares.
4. Ejecuta la app una vez para completar el flujo OAuth. Los refresh tokens se almacenar�n en plicacion/classroom_token.json (y en la carpeta userData de Electron para los planes de proyecto).

### OpenAI

1. Crea un archivo .env.local en la carpeta plicacion/.
2. Define tu clave:

   `ash
   OPENAI_API_KEY=sk-...tu-clave...
   `

   Tambi�n se aceptan los aliases API_KEY o VITE_OPENAI_API_KEY si prefieres otro nombre.

## Instalaci�n y ejecuci�n

`ash
git clone <url-del-repo>
cd prueba_APP/aplicacion
npm install
# Copia token.json y crea .env.local seg�n se describe arriba
npm run dev
`


pm run dev levanta Vite (renderer) y Electron en paralelo. La aplicaci�n abrir� una ventana de escritorio en cuanto el dev server est� disponible.

### Scripts disponibles

| Script | Descripci�n |
| --- | --- |
| 
pm run dev | Ejecuta renderer + Electron con recarga en caliente. |
| 
pm run renderer | Ejecuta solo el renderer de Vite (�til para depurar UI). |
| 
pm run electron | Arranca �nicamente la ventana Electron consumiendo el servidor ya levantado. |
| 
pm run build | Genera el bundle de producci�n (dist/). |
| 
pm run preview | Sirve la compilaci�n de Vite para ver el renderer sin Electron. |

> Nota: Para distribuir como escritorio necesitar�s un empaquetador (ej. electron-builder). Actualmente el proyecto est� listo para desarrollo y pruebas internas.

## Persistencia local

- **Tokens Google**: classroom_token.json (junto a package.json). Incluye access/refresh tokens; nunca lo subas al repositorio.
- **Planes de proyecto**: project_plans.json dentro de la ruta userData de Electron (p. ej. %APPDATA%/Flow/). Tambi�n se mantiene un respaldo en localStorage del renderer.
- **Historial de actividades Workspace**: localStorage bajo las claves unidevos.savedActivities y unidevos.projectPlans para recuperaci�n r�pida.

## Estructura relevante

- electron/: proceso principal (ventana, autenticaci�n Google, persistencia filesystem).
- pages/: vistas principales (Dashboard, Tasks, Workspace, Mail, Config).
- components/Sidebar.tsx: navegaci�n lateral adaptativa.
- services/: conectores (classroomService, geminiService/openAIService).
- 	ypes.ts: modelos compartidos entre vistas.
- ite.config.ts: alias, variables de entorno y puerto del dev server.

## Buenas pr�cticas para subir a GitHub

- Mant�n 	oken.json, classroom_token.json, project_plans.json y .env.local fuera del control de versiones.
- Renueva las credenciales de Google desde la vista de Configuraci�n si cambias de computadora.
- Documenta en issues o wiki cualquier flujo adicional (por ejemplo, la URL del webhook de N8N cuando se conecte el m�dulo de correo real).

Con esto tienes todo lo necesario para clonar, instalar y ejecutar Flow sin sobresaltos.
