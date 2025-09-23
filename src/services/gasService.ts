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

  // -------- GET (listar) --------
  private async get(sheet: string, query?: string): Promise<any[]> {
    // Reutilizamos la misma ruta POST con action:'list'
    const url = new URL(this.config.url);
    url.searchParams.set('key', this.config.apiKey);
    url.searchParams.set('origin', this.getOrigin());

    const res = await fetch(url.toString(), {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'text/plain' }, // evita preflight
      body: JSON.stringify({ action: 'list', sheet, q: query || '' }),
    });

    const data = await res.json();
    if (!res.ok || !data.ok) throw new Error(data?.error || `HTTP ${res.status}`);
    return data.items || [];
  }

  // -------- POST (append/update/delete) --------
  private async post(action: string, sheet: string, id?: string, item?: any): Promise<void> {
    if (!this.config.url) {
      console.log('GAS not configured, skipping remote operation');
      return;
    }
    if (!this.config.url || this.config.url === 'YOUR_GAS_URL_HERE') {
      throw new Error('Google Apps Script URL no configurada. Verifica tu archivo .env.local');
    }
    if (!this.config.apiKey || this.config.apiKey === 'YOUR_API_KEY_HERE') {
      throw new Error('API Key no configurada. Verifica tu archivo .env.local');
    }

    const body = { action, sheet, ...(id && { id }), ...(item && { item }) };

    // Construye URL con key + origin en query
    const url = new URL(this.config.url);
    url.searchParams.set('key', this.config.apiKey);
    url.searchParams.set('origin', this.getOrigin());

    const res = await fetch(url.toString(), {
      method: 'POST',
      mode: 'cors',                         // importante
      headers: { 'Content-Type': 'text/plain' }, // clave para evitar preflight
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok || !data.ok) throw new Error(data?.error || `HTTP ${res.status}`);
  }

  // -------- Students --------
  async getStudents(query?: string): Promise<Student[]> {
    const items = await this.get('Alumnos', query);
    return items.map(item => ({
      id: String(item.id ?? ''),
      nombre: String(item.nombre ?? ''),
      diasEntrenamiento: String(item.diasEntrenamiento ?? ''),
      coachAsignado: String(item.coachAsignado ?? ''),
      fechaInicio: String(item.fechaInicio ?? ''),
      fechaFin: String(item.fechaFin ?? ''),
      email: String(item.email ?? ''),
      telefono: String(item.telefono ?? ''),
      nivel: String(item.nivel ?? ''),
      objetivos: String(item.objetivos ?? ''),
      creado_at: String(item.creado_at ?? '')
    }));
  }

  async addStudent(student: Omit<Student, 'id' | 'creado_at'>): Promise<void> {
    const item = { id: Date.now().toString(), ...student };
    await this.post('append', 'Alumnos', undefined, item);
  }

  async updateStudent(id: string, student: Partial<Student>): Promise<void> {
    await this.post('update', 'Alumnos', id, student);
  }

  async deleteStudent(id: string): Promise<void> {
    await this.post('delete', 'Alumnos', id);
  }

  // -------- Coaches --------
  async getCoaches(query?: string): Promise<Coach[]> {
    const items = await this.get('Instructores', query);
    return items.map(item => ({
      id: String(item.id ?? ''),
      nombre: String(item.nombre ?? ''),
      email: String(item.email ?? ''),
      telefono: String(item.telefono ?? ''),
      especialidad: String(item.especialidad ?? ''),
      experiencia: String(item.experiencia ?? ''),
      certificaciones: String(item.certificaciones ?? ''),
      activo: Boolean(item.activo === 'TRUE' || item.activo === true || item.activo === 'true'),
      creado_at: String(item.creado_at ?? '')
    }));
  }

  async addCoach(coach: Omit<Coach, 'id' | 'creado_at'>): Promise<void> {
    const item = {
      id: Date.now().toString(),
      ...coach,
      activo: coach.activo ? 'TRUE' : 'FALSE', // a texto como en Sheet
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

  // -------- Training plans (localStorage) --------
  async getTrainingPlan(studentId: string): Promise<any> {
    try {
      return JSON.parse(localStorage.getItem(`wonderGymPlan_${studentId}`) || 'null');
    } catch (error) {
      console.error('Error loading training plan:', error);
      return null;
    }
  }

  async saveTrainingPlan(studentId: string, planData: any): Promise<void> {
    try {
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
    url: import.meta.env.VITE_GAS_URL || '',
    apiKey: import.meta.env.VITE_GAS_KEY || ''
  };

  if (!config.url || !config.apiKey || config.url === 'undefined' || config.apiKey === 'undefined') {
    console.log('GAS not configured, creating local-only service');
    return new GASService({ url: '', apiKey: '' });
  }

  gasService = new GASService(config);
  return gasService;
};

export const getGASService = (): GASService => {
  if (!gasService) return initializeGAS();
  return gasService;
};

export default GASService;
