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
    // If no URL configured, return empty array (will use localStorage)
    if (!this.config.url) {
      throw new Error('GAS not configured');
    }

    try {
      const params = new URLSearchParams({
        key: this.config.apiKey,
        sheet,
        origin: this.getOrigin()
      });

      if (query) {
        params.append('q', query);
      }

      const url = `${this.config.url}?${params.toString()}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.ok) {
        throw new Error(data.error || 'Unknown error');
      }

      return data.items || [];
    } catch (error) {
      console.error(`Error fetching from ${sheet}:`, error);
      throw error;
    }
  }

  // Generic POST request
  private async post(data: any): Promise<any> {
    try {
      const response = await fetch(this.config.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          key: this.config.apiKey,
          origin: this.getOrigin()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.ok) {
        throw new Error(result.error || 'Unknown error');
      }

      return result;
    } catch (error) {
      console.error('Error in POST request:', error);
      throw error;
    }
  }

  // Students methods
  async getStudents(query?: string): Promise<Student[]> {
    return this.get('Alumnos', query);
  }

  async addStudent(student: Omit<Student, 'id'>): Promise<void> {
    await this.post({
      action: 'append',
      sheet: 'Alumnos',
      item: {
        ...student,
        id: Date.now().toString()
      }
    });
  }

  async updateStudent(id: string, student: Partial<Student>): Promise<void> {
    await this.post({
      action: 'update',
      sheet: 'Alumnos',
      id,
      item: student
    });
  }

  async deleteStudent(id: string): Promise<void> {
    await this.post({
      action: 'delete',
      sheet: 'Alumnos',
      id
    });
  }

  // Coaches methods
  async getCoaches(query?: string): Promise<Coach[]> {
    return this.get('Instructores', query);
  }

  async addCoach(coach: Omit<Coach, 'id'>): Promise<void> {
    await this.post({
      action: 'append',
      sheet: 'Instructores',
      item: {
        ...coach,
        id: Date.now().toString()
      }
    });
  }

  async updateCoach(id: string, coach: Partial<Coach>): Promise<void> {
    await this.post({
      action: 'update',
      sheet: 'Instructores',
      id,
      item: coach
    });
  }

  async deleteCoach(id: string): Promise<void> {
    await this.post({
      action: 'delete',
      sheet: 'Instructores',
      id
    });
  }

  // Training plan methods
  async getTrainingPlan(studentId: string): Promise<any> {
    try {
      const plans = await this.get('Planes');
      const plan = plans.find((p: any) => p.studentId === studentId);

      if (plan && plan.plan) {
        try {
          return JSON.parse(plan.plan);
        } catch (e) {
          console.error('Error parsing plan JSON:', e);
          return null;
        }
      }

      return null;
    } catch (error) {
      console.error('Error getting training plan:', error);
      return null;
    }
  }

  async saveTrainingPlan(studentId: string, plan: any): Promise<void> {
    await this.post({
      action: 'savePlan',
      studentId,
      plan
    });
  }
}

// Export singleton instance
let gasService: GASService | null = null;

export const initializeGAS = (config: GASConfig) => {
  gasService = new GASService(config);
  return gasService;
};

export const getGASService = (): GASService => {
  if (!gasService) {
    throw new Error('GAS service not initialized. Call initializeGAS first.');
  }
  return gasService;
};

export default GASService;
