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

  // Initialize GAS service
  useEffect(() => {
    try {
      const gasUrl = import.meta.env.VITE_GAS_URL || '';
      const gasKey = import.meta.env.VITE_GAS_KEY || '';

      console.log('Initializing GAS with config:', {
        url: gasUrl ? 'Set' : 'Missing',
        key: gasKey ? 'Set' : 'Missing',
      });

      // Check if we have valid configuration
      if (!gasUrl || gasUrl === 'YOUR_GAS_URL_HERE' || !gasKey || gasKey === 'YOUR_API_KEY_HERE' || gasUrl === 'undefined' || gasKey === 'undefined' || gasUrl === '' || gasKey === '') {
        console.warn('GAS not properly configured, using localStorage only');
        setIsConnected(false);
        setError(null); // Don't show error for intentional local-only mode
        loadInitialDataFromLocalStorage();
      } else {
        console.log('GAS service initialized successfully');
        // Initialize GAS service
        getGASService();
        setIsConnected(true);
        loadInitialDataWithGASFallback();
      }
    } catch (err) {
      console.error('GAS initialization error:', err);
      setIsConnected(false);
      setError(null); // Don't show error, just use local mode
      loadInitialDataFromLocalStorage();
    }
  }, []);

  // Load data only from localStorage
  const loadInitialDataFromLocalStorage = () => {
    console.log('Loading data from localStorage only...');

    const savedStudents = localStorage.getItem('wonderGymStudents');
    const savedCoaches = localStorage.getItem('wonderGymCoaches');

    if (savedStudents) {
      try {
        const parsedStudents = JSON.parse(savedStudents);
        console.log('Loaded students from localStorage:', parsedStudents);
        setStudents(parsedStudents);
      } catch (err) {
        console.error('Error parsing saved students:', err);
        setStudents([]);
      }
    } else {
      console.log('No students found in localStorage');
      setStudents([]);
    }

    if (savedCoaches) {
      try {
        const parsedCoaches = JSON.parse(savedCoaches);
        console.log('Loaded coaches from localStorage:', parsedCoaches);
        setCoaches(parsedCoaches);
      } catch (err) {
        console.error('Error parsing saved coaches:', err);
        setCoaches([]);
      }
    } else {
      console.log('No coaches found in localStorage');
      setCoaches([]);
    }
  };

  // Load initial data with GAS fallback
  const loadInitialDataWithGASFallback = async () => {
    console.log('Loading initial data with GAS fallback...');

    // Always load from localStorage first (immediate)
    loadInitialDataFromLocalStorage();

    // Only try to load from GAS if connected
    if (isConnected) {
      console.log('Attempting to load from Google Sheets...');
      try {
        await loadStudentsFromGAS();
        await loadCoachesFromGAS();
        console.log('Successfully loaded from Google Sheets');
        setError(null);
      } catch (err) {
        console.warn('Could not load from GAS, using localStorage data:', err);
        setIsConnected(false);
      }
    }
  };

  // Load students from GAS
  const loadStudentsFromGAS = async (query?: string) => {
    console.log('loadStudentsFromGAS called');

    if (!isConnected) {
      console.log('GAS not connected, skipping remote load');
      return;
    }

    setLoading(true);

    try {
      const gasService = getGASService();
      const studentsData = await gasService.getStudents(query);
      console.log('Students data from GAS:', studentsData.length, 'items');
      setStudents(studentsData);

      // Also save to localStorage as backup
      localStorage.setItem('wonderGymStudents', JSON.stringify(studentsData));
    } catch (err: any) {
      console.error('Load students error:', err);
      // Don't throw error, just log it and continue with local data
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  // Load coaches from GAS
  const loadCoachesFromGAS = async (query?: string) => {
    console.log('loadCoachesFromGAS called');

    if (!isConnected) {
      console.log('GAS not connected, skipping remote load');
      return;
    }

    setLoading(true);

    try {
      const gasService = getGASService();
      const coachesData = await gasService.getCoaches(query);
      console.log('Coaches data from GAS:', coachesData.length, 'items');
      setCoaches(coachesData);

      // Also save to localStorage as backup
      localStorage.setItem('wonderGymCoaches', JSON.stringify(coachesData));
    } catch (err: any) {
      console.error('Load coaches error:', err);
      // Don't throw error, just log it and continue with local data
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  // Public functions for manual loading
  const loadStudents = async (query?: string) => {
    if (isConnected) {
      await loadStudentsFromGAS(query);
    } else {
      console.log('GAS not connected, using localStorage only');
    }
  };

  const loadCoaches = async (query?: string) => {
    if (isConnected) {
      await loadCoachesFromGAS(query);
    } else {
      console.log('GAS not connected, using localStorage only');
    }
  };

  // Add student
  const addStudent = async (student: Omit<Student, 'id' | 'creado_at'>) => {
    const newStudent: Student = {
      ...student,
      id: Date.now().toString(),
      creado_at: new Date().toISOString()
    };

    // Always update local state first for immediate UI feedback
    const updatedStudents = [...students, newStudent];
    setStudents(updatedStudents);
    localStorage.setItem('wonderGymStudents', JSON.stringify(updatedStudents));

    // Try to sync with Google Sheets in background
    if (isConnected) {
      try {
        const gasService = getGASService();
        await gasService.addStudent(student);
        console.log('Student synced to Google Sheets successfully');
      } catch (err: any) {
        console.warn('Failed to sync to Google Sheets, but saved locally:', err.message);
        // Don't show error for sync failures if local save worked
      }
    }
  };

  // Delete student
  const deleteStudent = async (id: string) => {
    // Always update local state first
    const updatedStudents = students.filter(s => s.id !== id);
    setStudents(updatedStudents);
    localStorage.setItem('wonderGymStudents', JSON.stringify(updatedStudents));

    // Try to sync with Google Sheets in background
    if (isConnected) {
      try {
        const gasService = getGASService();
        await gasService.deleteStudent(id);
        console.log('Student deleted from Google Sheets successfully');
      } catch (err: any) {
        console.warn('Failed to sync deletion to Google Sheets:', err.message);
        // Don't show error for sync failures if local deletion worked
      }
    }
  };
  // Update student
  const updateStudent = async (id: string, student: Partial<Student>) => {
    // Always update local state first
    const updatedStudents = students.map(s =>
      s.id === id ? { ...s, ...student } : s
    );
    setStudents(updatedStudents);
    localStorage.setItem('wonderGymStudents', JSON.stringify(updatedStudents));

    // Try to sync with Google Sheets in background
    if (isConnected) {
      try {
        const gasService = getGASService();
        await gasService.updateStudent(id, student);
        console.log('Student updated in Google Sheets successfully');
      } catch (err: any) {
        console.warn('Failed to sync update to Google Sheets:', err.message);
        // Don't show error for sync failures if local update worked
      }
    }
  };


  // Add coach
  const addCoach = async (coach: Omit<Coach, 'id' | 'creado_at'>) => {
    const newCoach: Coach = {
      ...coach,
      id: Date.now().toString(),
      creado_at: new Date().toISOString()
    };

    // Always update local state first for immediate UI feedback
    const updatedCoaches = [...coaches, newCoach];
    setCoaches(updatedCoaches);
    localStorage.setItem('wonderGymCoaches', JSON.stringify(updatedCoaches));

    // Try to sync with Google Sheets in background
    if (isConnected) {
      try {
        const gasService = getGASService();
        await gasService.addCoach(coach);
        console.log('Coach synced to Google Sheets successfully');
      } catch (err: any) {
        console.warn('Failed to sync to Google Sheets, but saved locally:', err.message);
        // Don't show error for sync failures if local save worked
      }
    }
  };

  // Update coach
  const updateCoach = async (id: string, coach: Partial<Coach>) => {
    // Always update local state first
    const updatedCoaches = coaches.map(c =>
      c.id === id ? { ...c, ...coach } : c
    );
    setCoaches(updatedCoaches);
    localStorage.setItem('wonderGymCoaches', JSON.stringify(updatedCoaches));

    // Try to sync with Google Sheets in background
    if (isConnected) {
      try {
        const gasService = getGASService();
        await gasService.updateCoach(id, coach);
        console.log('Coach updated in Google Sheets successfully');
      } catch (err: any) {
        console.warn('Failed to sync update to Google Sheets:', err.message);
        // Don't show error for sync failures if local update worked
      }
    }
  };

  // Delete coach
  const deleteCoach = async (id: string) => {
    // Always update local state first
    const updatedCoaches = coaches.filter(c => c.id !== id);
    setCoaches(updatedCoaches);
    localStorage.setItem('wonderGymCoaches', JSON.stringify(updatedCoaches));

    // Try to sync with Google Sheets in background
    if (isConnected) {
      try {
        const gasService = getGASService();
        await gasService.deleteCoach(id);
        console.log('Coach deleted from Google Sheets successfully');
      } catch (err: any) {
        console.warn('Failed to sync deletion to Google Sheets:', err.message);
        // Don't show error for sync failures if local deletion worked
      }
    }
  };

  // Load training plan
  const loadTrainingPlan = async (studentId: string) => {
    try {
      const gasService = getGASService();
      return await gasService.getTrainingPlan(studentId);
    } catch (err) {
      console.error('Failed to load training plan:', err);
      return null;
    }
  };

  // Save training plan
  const saveTrainingPlan = async (studentId: string, planData: any) => {
    try {
      const gasService = getGASService();
      await gasService.saveTrainingPlan(studentId, planData);
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
    setError
  };
};