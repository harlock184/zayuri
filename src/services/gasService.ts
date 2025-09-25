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
  // -------- GET (listar) --------
  private async get(sheet: string, query?: string): Promise<any[]> {
    const url = new URL(this.config.url);               // debe ser .../exec
    url.searchParams.set('key', this.config.apiKey);
    url.searchParams.set('origin', this.getOrigin());
    url.searchParams.set('sheet', sheet);
    if (query) url.searchParams.set('q', query);

    const res = await fetch(url.toString(), {
      method: 'GET',
      mode: 'cors',
      cache: 'no-store',
    });

    const data = await res.json();
    if (!res.ok || !data.ok) throw new Error(data?.error || `HTTP ${res.status}`);
    return data.items || [];
  }


  // -------- POST (append/update/delete) --------
  private async post(
    action: string,
    sheet: string,
    id?: string,
    item?: any,
    studentId?: string,
    plan?: any
  ): Promise<void> {
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

    const body: any = { action, sheet };
    if (id) body.id = id;
    if (item) body.item = item;
    if (studentId) body.studentId = studentId;
    if (plan) body.plan = plan;

    const url = new URL(this.config.url);
    url.searchParams.set('key', this.config.apiKey);
    url.searchParams.set('origin', this.getOrigin());

    const res = await fetch(url.toString(), {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'text/plain' },
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


  // -------- Training plans (Google Sheets en hoja "Planes") --------
  async saveTrainingPlan(studentId: string, planData: any): Promise<void> {
    try {
      // guarda en GAS (hoja Planes)
      await this.post('savePlan', 'Planes', undefined, undefined, studentId, planData);

      // opcional: también guarda en localStorage como backup
      localStorage.setItem(`wonderGymPlan_${studentId}`, JSON.stringify(planData));
    } catch (error) {
      console.error('Error saving training plan to GAS:', error);
      throw error;
    }
  }

  async getTrainingPlan(studentId: string): Promise<any> {
    try {
      const url = new URL(this.config.url);
      url.searchParams.set('key', this.config.apiKey);
      url.searchParams.set('origin', this.getOrigin());
      url.searchParams.set('sheet', 'Planes');
      url.searchParams.set('q', studentId);

      const res = await fetch(url.toString(), { method: 'GET', mode: 'cors', cache: 'no-store' });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data?.error || `HTTP ${res.status}`);

      if (data.items && data.items.length > 0) {
        return JSON.parse(data.items[0].plan || '{}'); // 👈 recupera el JSON guardado
      }

      return null;
    } catch (error) {
      console.error('Error loading training plan from GAS:', error);
      return null;
    }
  }


  // // -------- Training plans (localStorage) --------
  // async getTrainingPlan(studentId: string): Promise<any> {
  //   try {
  //     return JSON.parse(localStorage.getItem(`wonderGymPlan_${studentId}`) || 'null');
  //   } catch (error) {
  //     console.error('Error loading training plan:', error);
  //     return null;
  //   }
  // }

  // async saveTrainingPlan(studentId: string, planData: any): Promise<void> {
  //   try {
  //     localStorage.setItem(`wonderGymPlan_${studentId}`, JSON.stringify(planData));
  //   } catch (error) {
  //     console.error('Error saving training plan:', error);
  //     throw error;
  //   }
  // }
}

// Export singleton instance
let gasService: GASService | null = null;

export const initializeGAS = (): GASService => {
  console.log("[WG] VITE_GAS_URL =", import.meta.env.VITE_GAS_URL);
  console.log("[WG] VITE_GAS_KEY length =", (import.meta.env.VITE_GAS_KEY || "").length);
  const config = {
    url: import.meta.env.VITE_GAS_URL || '',
    apiKey: import.meta.env.VITE_GAS_KEY || ''
  };

  if (!config.url || !config.apiKey || config.url === 'undefined' || config.apiKey === 'undefined') {
    console.log('GAS not configured, creating local-only service');
    return new GASService({ url: '', apiKey: '' });
  }

  console.log("[WG] initializeGAS config =", config);


  gasService = new GASService(config);
  return gasService;
};

export const getGASService = (): GASService => {
  if (!gasService) {
    console.log("[WG] getGASService: creando instancia");
    console.log("[WG] VITE_GAS_URL =", import.meta.env.VITE_GAS_URL);
    console.log("[WG] VITE_GAS_KEY length =", (import.meta.env.VITE_GAS_KEY || "").length);

    return initializeGAS();
  }
  console.log("[WG] getGASService: usando instancia ya creada");
  return gasService;
};


export default GASService;
