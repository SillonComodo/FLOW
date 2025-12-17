import { Task } from '../types';

// Global types for Google APIs
declare global {
  interface Window {
    google: any;
    gapi: any;
  }
}

// IMPORTANTE: Para evitar el "Error 400: invalid_request / Access blocked", el Client ID debe ser de tipo "Aplicación Web".
// Define VITE_GOOGLE_CLIENT_ID en tu .env.local con el ID generado en Google Cloud Console (Origen autorizado: URL local de Vite).
const CLIENT_ID = ((import.meta as any)?.env?.VITE_GOOGLE_CLIENT_ID as string) || '';

const SCOPES = 'https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.coursework.me.readonly';

let tokenClient: any;
let gapiInited = false;

export const initGapi = () => {
  return new Promise<void>((resolve, reject) => {
    if (gapiInited) return resolve();
    
    if (!window.gapi) {
        // Fail silently if script not loaded yet, retry logic handled in components
        console.warn("Google API Script not loaded yet");
        return; 
    }

    window.gapi.load('client', async () => {
      try {
        await window.gapi.client.init({
          discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/classroom/v1/rest"],
        });
        gapiInited = true;
        resolve();
      } catch (err) {
        console.error("Error initializing GAPI client", err);
        reject(err);
      }
    });
  });
};

export const initTokenClient = (callback: (response: any) => void) => {
  if (!window.google) return;
  
  try {
      tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: async (resp: any) => {
          if (resp.error !== undefined) {
            throw (resp);
          }
          callback(resp);
        },
      });
  } catch (error) {
      console.error("Error initializing token client:", error);
  }
};

export const triggerAuth = () => {
  if (tokenClient) {
    // Si el ID de cliente es incorrecto (tipo Desktop), el popup mostrará el error 400.
    // No hay forma de capturar ese error desde código ya que ocurre dentro del popup seguro de Google.
    tokenClient.requestAccessToken({ prompt: 'consent' });
  } else {
    console.error("Token client not initialized. Check your Client ID configuration.");
    alert("No se pudo iniciar el cliente de autenticación. Verifica que el Client ID sea correcto y de tipo Web.");
  }
};

const formatDate = (date: {year?: number, month?: number, day?: number} | undefined): string => {
    if (!date || !date.year || !date.month || !date.day) return 'Sin fecha';
    return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
};

export const fetchClassroomData = async (): Promise<Task[]> => {
    try {
        // Check if GAPI is ready
        if (!window.gapi?.client?.classroom) {
            throw new Error("Classroom API not loaded");
        }

        // 1. Fetch Courses
        const coursesResponse = await window.gapi.client.classroom.courses.list({
            courseStates: ['ACTIVE']
        });
        
        const courses = coursesResponse.result.courses || [];
        let allTasks: Task[] = [];

        // 2. Fetch CourseWork for each course (in parallel)
        const courseWorkPromises = courses.map(async (course: any) => {
            try {
                const workResponse = await window.gapi.client.classroom.courses.courseWork.list({
                    courseId: course.id,
                    orderBy: 'dueDate asc',
                    pageSize: 5 
                });
                
                const works = workResponse.result.courseWork || [];
                
                return works.map((work: any) => ({
                    id: work.id,
                    title: `${course.name}: ${work.title}`,
                    source: 'Classroom',
                    dueDate: formatDate(work.dueDate),
                    status: 'pending',
                    priority: 'medium'
                } as Task));
            } catch (e) {
                console.warn(`Could not fetch work for course ${course.id}`, e);
                return [];
            }
        });

        const results = await Promise.all(courseWorkPromises);
        results.forEach(tasks => {
            allTasks = [...allTasks, ...tasks];
        });

        return allTasks;

    } catch (error) {
        console.error("Error fetching classroom data:", error);
        throw error;
    }
}