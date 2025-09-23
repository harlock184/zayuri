// Google Apps Script Service
interface GASConfig {
  url: string;
  apiKey: string;
}

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

class GASService {
  private config: GASConfig;

  constructor(config: GASConfig) {
    this.config = config;
  }

  private getOrigin(): string {
    return window.location.origin;
  }

  // Generic GET request
  private async get(sheet: string, query?: string): Promise<any[]> {
    try {
      const params = new URLSearchParams({
        key: this.config.apiKey,
        sheet,
        origin: this.getOrigin()
      });

      if (query) {
        params.append('q', query);
      }

      const response = await fetch(`${this.config.url}?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.ok) {
        throw new Error(data.error || 'Unknown error');
      }

      return data.items || [];
    } catch (error) {
      console.error(`Error fetching ${sheet}:`, error);
      throw error;
    }
  }

  // Generic POST request
  private async post(action: string, sheet: string, id?: string, item?: any): Promise<void> {
    try {
      // Validate configuration first
      if (!this.config.url || this.config.url === 'YOUR_GAS_URL_HERE') {
        throw new Error('Google Apps Script URL no configurada. Verifica tu archivo .env.local');
      }
      
      if (!this.config.apiKey || this.config.apiKey === 'YOUR_API_KEY_HERE') {
        throw new Error('API Key no configurada. Verifica tu archivo .env.local');
      }

      const body = {
        action,
        sheet,
        ...(id && { id }),
        ...(item && { item })
      };

      console.log('Sending POST request:', {
        url: this.config.url,
        body: body,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      // Add query parameters for key and origin
      const url = new URL(this.config.url);
      url.searchParams.append('key', this.config.apiKey);
      url.searchParams.append('origin', this.getOrigin());

      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        mode: 'no-cors' // Try no-cors mode for Google Apps Script
      });

      console.log('Response status:', response.status);

      // With no-cors mode, we can't read the response
      // Google Apps Script should return success if no error is thrown
      if (response.type === 'opaque') {
        // Request was sent successfully with no-cors
        console.log('Request sent successfully (no-cors mode)');
        return;
      }

      // If we can read the response (shouldn't happen with no-cors)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

    } catch (error) {
      console.error(`Error ${action} ${sheet}:`, error);
      
      // Provide more specific error messages
      if (error.message.includes('Failed to fetch')) {
        throw new Error('No se pudo conectar al Google Apps Script. Verifica la URL y que esté desplegado correctamente.');
      }
      
      throw error;
    }
  }

  // Students methods
  async getStudents(query?: string): Promise<Student[]> {
    const items = await this.get('Alumnos', query);
    return items.map(item => ({
      id: String(item.id || ''),
      nombre: String(item.nombre || ''),
      diasEntrenamiento: String(item.diasEntrenamiento || ''),
      coachAsignado: String(item.coachAsignado || ''),
      fechaInicio: String(item.fechaInicio || ''),
      fechaFin: String(item.fechaFin || ''),
      email: String(item.email || ''),
      telefono: String(item.telefono || ''),
      nivel: String(item.nivel || ''),
      objetivos: String(item.objetivos || ''),
      creado_at: String(item.creado_at || '')
    }));
  }

  async addStudent(student: Omit<Student, 'id' | 'creado_at'>): Promise<void> {
    const item = {
      id: Date.now().toString(), // Generate ID
      ...student
    };
    await this.post('append', 'Alumnos', undefined, item);
  }

  async updateStudent(id: string, student: Partial<Student>): Promise<void> {
    await this.post('update', 'Alumnos', id, student);
  }

  async deleteStudent(id: string): Promise<void> {
    await this.post('delete', 'Alumnos', id);
  }

  // Coaches methods
  async getCoaches(query?: string): Promise<Coach[]> {
    const items = await this.get('Instructores', query);
    return items.map(item => ({
      id: String(item.id || ''),
      nombre: String(item.nombre || ''),
      email: String(item.email || ''),
      telefono: String(item.telefono || ''),
      especialidad: String(item.especialidad || ''),
      experiencia: String(item.experiencia || ''),
      certificaciones: String(item.certificaciones || ''),
      activo: Boolean(item.activo === 'TRUE' || item.activo === true || item.activo === 'true'),
      creado_at: String(item.creado_at || '')
    }));
  }

  async addCoach(coach: Omit<Coach, 'id' | 'creado_at'>): Promise<void> {
    const item = {
      id: Date.now().toString(), // Generate ID
      ...coach,
      activo: coach.activo ? 'TRUE' : 'FALSE' // Convert boolean to string
    };
    await this.post('append', 'Instructores', undefined, item);
  }

  async updateCoach(id: string, coach: Partial<Coach>): Promise<void> {
    const item = {
      ...coach,
      ...(coach.activo !== undefined && { activo: coach.activo ? 'TRUE' : 'FALSE' })
    };
    await this.post('update', 'Instructores', id, item);
  }

  async deleteCoach(id: string): Promise<void> {
    await this.post('delete', 'Instructores', id);
  }

  // Training plans (stored as JSON in a separate sheet or as part of student data)
  async getTrainingPlan(studentId: string): Promise<any> {
    try {
      // For now, we'll store training plans in localStorage
      // You can extend your GAS to handle training plans if needed
      return JSON.parse(localStorage.getItem(`wonderGymPlan_${studentId}`) || 'null');
    } catch (error) {
      console.error('Error loading training plan:', error);
      return null;
    }
  }

  async saveTrainingPlan(studentId: string, planData: any): Promise<void> {
    try {
      // For now, we'll store training plans in localStorage
      // You can extend your GAS to handle training plans if needed
      localStorage.setItem(`wonderGymPlan_${studentId}`, JSON.stringify(planData));
    } catch (error) {
      console.error('Error saving training plan:', error);
      throw error;
    }
  }
}

// Export singleton instance
let gasService: GASService | null = null;

export const initializeGAS = (): GASService => {
  const config = {
    url: import.meta.env.VITE_GAS_URL,
    apiKey: import.meta.env.VITE_GAS_KEY
  };

  if (!config.url || !config.apiKey) {
    throw new Error('GAS configuration missing. Check your .env.local file.');
  }

  gasService = new GASService(config);
  return gasService;
};

export const getGASService = (): GASService => {
  if (!gasService) {
    return initializeGAS();
  }
  return gasService;
};

export default GASService;