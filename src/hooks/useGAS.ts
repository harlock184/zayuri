import { useState, useEffect } from 'react';
import { getGASService } from '../services/gasService';

interface Student {
  id: string;
  nombre: string;
  diasEntrenamiento: string;
  coachAsignado: string;
  fechaInicio: string;
  fechaFin: string;
  email?: string;
  telefono?: string;
  nivel?: string;
  objetivos?: string;
  creado_at?: string;
}

interface Coach {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  especialidad: string;
  experiencia: string;
  certificaciones: string;
  activo: boolean;
  creado_at?: string;
}

export const useGAS = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  /******************** INIT ********************/
  useEffect(() => {
    try {
      const gasUrl = import.meta.env.VITE_GAS_URL || '';
      const gasKey = import.meta.env.VITE_GAS_KEY || '';

      console.log('Initializing GAS with config:', {
        url: gasUrl ? 'Set' : 'Missing',
        key: gasKey ? 'Set' : 'Missing',
      });

      // Flag local – no dependemos del estado aún
      const connected =
        !!gasUrl &&
        gasUrl !== 'YOUR_GAS_URL_HERE' &&
        gasUrl !== 'undefined' &&
        gasUrl.trim() !== '' &&
        !!gasKey &&
        gasKey !== 'YOUR_API_KEY_HERE' &&
        gasKey !== 'undefined' &&
        gasKey.trim() !== '';

      setIsConnected(connected);

      if (!connected) {
        console.warn('GAS not properly configured, using localStorage only');
        setError(null);
        loadInitialDataFromLocalStorage();
      } else {
        console.log('GAS service initialized successfully');
        // Inicializa service y arranca carga inmediata
        getGASService();
        loadInitialDataWithGASFallback(true);
      }
    } catch (err) {
      console.error('GAS initialization error:', err);
      setIsConnected(false);
      setError(null);
      loadInitialDataFromLocalStorage();
    }
  }, []);

  /******************** LOCAL LOAD ********************/
  const loadInitialDataFromLocalStorage = () => {
    console.log('Loading data from localStorage only...');

    try {
      const savedStudents = localStorage.getItem('wonderGymStudents');
      if (savedStudents) {
        const parsed = JSON.parse(savedStudents);
        console.log('Loaded students from localStorage:', parsed);
        setStudents(parsed);
      } else {
        console.log('No students found in localStorage');
        setStudents([]);
      }
    } catch (e) {
      console.error('Error parsing saved students:', e);
      setStudents([]);
    }

    try {
      const savedCoaches = localStorage.getItem('wonderGymCoaches');
      if (savedCoaches) {
        const parsed = JSON.parse(savedCoaches);
        console.log('Loaded coaches from localStorage:', parsed);
        setCoaches(parsed);
      } else {
        console.log('No coaches found in localStorage');
        setCoaches([]);
      }
    } catch (e) {
      console.error('Error parsing saved coaches:', e);
      setCoaches([]);
    }
  };

  /******************** INITIAL REMOTE LOAD (FALLBACK) ********************/
  // Recibe flag local para no depender del timing de setIsConnected
  const loadInitialDataWithGASFallback = async (connectedFlag: boolean) => {
    console.log('Loading initial data with GAS fallback...');
    // Pinta algo al instante
    loadInitialDataFromLocalStorage();

    if (!connectedFlag) return;

    try {
      console.log('Attempting to load from Google Sheets...');
      await Promise.all([loadStudentsFromGAS(), loadCoachesFromGAS()]);
      console.log('Successfully loaded from Google Sheets');
      setError(null);
    } catch (err) {
      console.warn('Could not load from GAS, using localStorage data:', err);
      // No apagues isConnected por un fallo puntual de red
    }
  };

  /******************** REMOTE LOADERS ********************/
  // Importante: sin "early return" por isConnected. Siempre intenta y cae a local por catch.
  const loadStudentsFromGAS = async (query?: string) => {
    console.log('loadStudentsFromGAS called (will try remote, fallback on error)');
    setLoading(true);
    try {
      const gas = getGASService();
      const items = await gas.getStudents(query);
      console.log('Students data from GAS:', items.length, 'items');
      setStudents(items);
      localStorage.setItem('wonderGymStudents', JSON.stringify(items));
    } catch (err) {
      console.warn('Load students from GAS failed, keeping local:', err);
      // Mantén local si falla
    } finally {
      setLoading(false);
    }
  };

  const loadCoachesFromGAS = async (query?: string) => {
    console.log('loadCoachesFromGAS called (will try remote, fallback on error)');
    setLoading(true);
    try {
      const gas = getGASService();
      const items = await gas.getCoaches(query);
      console.log('Coaches data from GAS:', items.length, 'items');
      setCoaches(items);
      localStorage.setItem('wonderGymCoaches', JSON.stringify(items));
    } catch (err) {
      console.warn('Load coaches from GAS failed, keeping local:', err);
    } finally {
      setLoading(false);
    }
  };

  /******************** PUBLIC LOADERS ********************/
  const loadStudents = async (query?: string) => {
    try {
      await loadStudentsFromGAS(query);
    } catch {
      console.log('Falling back to local students');
      loadInitialDataFromLocalStorage();
    }
  };

  const loadCoaches = async (query?: string) => {
    try {
      await loadCoachesFromGAS(query);
    } catch {
      console.log('Falling back to local coaches');
      loadInitialDataFromLocalStorage();
    }
  };

  /******************** MUTATIONS (OPTIMISTIC UI + REFRESH REMOTO) ********************/
  const addStudent = async (student: Omit<Student, 'id' | 'creado_at'>) => {
    const newStudent: Student = {
      ...student,
      id: Date.now().toString(),
      creado_at: new Date().toISOString(),
    };

    const updated = [...students, newStudent];
    setStudents(updated);
    localStorage.setItem('wonderGymStudents', JSON.stringify(updated));

    try {
      const gas = getGASService();
      await gas.addStudent(student);
      console.log('Student synced to Google Sheets successfully');
      // refresca estado desde Sheets
      await loadStudentsFromGAS();
    } catch (err: any) {
      console.warn('Failed to sync to Google Sheets, but saved locally:', err?.message || err);
    }
  };

  const deleteStudent = async (id: string) => {
    const updated = students.filter(s => s.id !== id);
    setStudents(updated);
    localStorage.setItem('wonderGymStudents', JSON.stringify(updated));

    try {
      const gas = getGASService();
      await gas.deleteStudent(id);
      console.log('Student deleted from Google Sheets successfully');
      await loadStudentsFromGAS();
    } catch (err: any) {
      console.warn('Failed to sync deletion to Google Sheets:', err?.message || err);
    }
  };

  const updateStudent = async (id: string, student: Partial<Student>) => {
    const updated = students.map(s => (s.id === id ? { ...s, ...student } : s));
    setStudents(updated);
    localStorage.setItem('wonderGymStudents', JSON.stringify(updated));

    try {
      const gas = getGASService();
      await gas.updateStudent(id, student);
      console.log('Student updated in Google Sheets successfully');
      await loadStudentsFromGAS();
    } catch (err: any) {
      console.warn('Failed to sync update to Google Sheets:', err?.message || err);
    }
  };

  const addCoach = async (coach: Omit<Coach, 'id' | 'creado_at'>) => {
    const newCoach: Coach = {
      ...coach,
      id: Date.now().toString(),
      creado_at: new Date().toISOString(),
    };

    const updated = [...coaches, newCoach];
    setCoaches(updated);
    localStorage.setItem('wonderGymCoaches', JSON.stringify(updated));

    try {
      const gas = getGASService();
      await gas.addCoach(coach);
      console.log('Coach synced to Google Sheets successfully');
      await loadCoachesFromGAS();
    } catch (err: any) {
      console.warn('Failed to sync to Google Sheets, but saved locally:', err?.message || err);
    }
  };

  const updateCoach = async (id: string, coach: Partial<Coach>) => {
    const updated = coaches.map(c => (c.id === id ? { ...c, ...coach } : c));
    setCoaches(updated);
    localStorage.setItem('wonderGymCoaches', JSON.stringify(updated));

    try {
      const gas = getGASService();
      await gas.updateCoach(id, coach);
      console.log('Coach updated in Google Sheets successfully');
      await loadCoachesFromGAS();
    } catch (err: any) {
      console.warn('Failed to sync update to Google Sheets:', err?.message || err);
    }
  };

  const deleteCoach = async (id: string) => {
    const updated = coaches.filter(c => c.id !== id);
    setCoaches(updated);
    localStorage.setItem('wonderGymCoaches', JSON.stringify(updated));

    try {
      const gas = getGASService();
      await gas.deleteCoach(id);
      console.log('Coach deleted from Google Sheets successfully');
      await loadCoachesFromGAS();
    } catch (err: any) {
      console.warn('Failed to sync deletion to Google Sheets:', err?.message || err);
    }
  };

  /******************** TRAINING PLAN ********************/
  const loadTrainingPlan = async (studentId: string) => {
    try {
      const gas = getGASService();
      return await gas.getTrainingPlan(studentId);
    } catch (err) {
      console.error('Failed to load training plan:', err);
      return null;
    }
  };

  const saveTrainingPlan = async (studentId: string, planData: any) => {
    try {
      const gas = getGASService();
      await gas.saveTrainingPlan(studentId, planData);
    } catch (err: any) {
      setError(`Failed to save training plan: ${err.message}`);
      console.error('Save training plan error:', err);
      throw err;
    }
  };

  return {
    students,
    coaches,
    loading,
    error,
    isConnected,
    loadStudents,
    loadCoaches,
    addStudent,
    updateStudent,
    deleteStudent,
    addCoach,
    updateCoach,
    deleteCoach,
    loadTrainingPlan,
    saveTrainingPlan,
    setStudents,
    setCoaches,
    setError,
  };
};
