// Google Sheets Service
interface GoogleSheetsConfig {
  spreadsheetId: string;
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
}

class GoogleSheetsService {
  private config: GoogleSheetsConfig;
  private baseUrl: string;

  constructor(config: GoogleSheetsConfig) {
    this.config = config;
    this.baseUrl = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}`;
  }

  // Generic method to fetch data from a sheet
  private async fetchSheetData(sheetName: string): Promise<any[][]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/values/${sheetName}?key=${this.config.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.values || [];
    } catch (error) {
      console.error(`Error fetching data from ${sheetName}:`, error);
      throw error;
    }
  }

  // Generic method to update data in a sheet
  private async updateSheetData(sheetName: string, range: string, values: any[][]): Promise<void> {
    try {
      // Note: This requires OAuth2 authentication for write operations
      // For now, we'll show the structure but you'll need to implement OAuth2
      console.log('Update operation would be performed here with OAuth2');
      console.log('Sheet:', sheetName, 'Range:', range, 'Values:', values);
      
      // For write operations, you'll need to use OAuth2 instead of API key
      // This is a placeholder for the actual implementation
    } catch (error) {
      console.error(`Error updating data in ${sheetName}:`, error);
      throw error;
    }
  }

  // Convert sheet rows to Student objects
  private rowsToStudents(rows: any[][]): Student[] {
    if (rows.length <= 1) return []; // Skip header row
    
    return rows.slice(1).map((row, index) => ({
      id: row[0] || `student_${index + 1}`,
      nombre: row[1] || '',
      diasEntrenamiento: row[2] || '',
      coachAsignado: row[3] || '',
      fechaInicio: row[4] || '',
      fechaFin: row[5] || '',
      email: row[6] || '',
      telefono: row[7] || '',
      nivel: row[8] || '',
      objetivos: row[9] || ''
    }));
  }

  // Convert sheet rows to Coach objects
  private rowsToCoaches(rows: any[][]): Coach[] {
    if (rows.length <= 1) return []; // Skip header row
    
    return rows.slice(1).map((row, index) => ({
      id: row[0] || `coach_${index + 1}`,
      nombre: row[1] || '',
      email: row[2] || '',
      telefono: row[3] || '',
      especialidad: row[4] || '',
      experiencia: row[5] || '',
      certificaciones: row[6] || '',
      activo: row[7] === 'TRUE' || row[7] === 'true' || row[7] === true
    }));
  }

  // Fetch all students
  async getStudents(): Promise<Student[]> {
    try {
      const rows = await this.fetchSheetData('Students');
      return this.rowsToStudents(rows);
    } catch (error) {
      console.error('Error fetching students:', error);
      return [];
    }
  }

  // Fetch all coaches
  async getCoaches(): Promise<Coach[]> {
    try {
      const rows = await this.fetchSheetData('Coaches');
      return this.rowsToCoaches(rows);
    } catch (error) {
      console.error('Error fetching coaches:', error);
      return [];
    }
  }

  // Add a new student (requires OAuth2 for write operations)
  async addStudent(student: Omit<Student, 'id'>): Promise<void> {
    const newRow = [
      Date.now().toString(), // Generate ID
      student.nombre,
      student.diasEntrenamiento,
      student.coachAsignado,
      student.fechaInicio,
      student.fechaFin,
      student.email || '',
      student.telefono || '',
      student.nivel || '',
      student.objetivos || ''
    ];

    await this.updateSheetData('Students', 'A:J', [newRow]);
  }

  // Add a new coach (requires OAuth2 for write operations)
  async addCoach(coach: Omit<Coach, 'id'>): Promise<void> {
    const newRow = [
      Date.now().toString(), // Generate ID
      coach.nombre,
      coach.email,
      coach.telefono,
      coach.especialidad,
      coach.experiencia,
      coach.certificaciones,
      coach.activo.toString()
    ];

    await this.updateSheetData('Coaches', 'A:H', [newRow]);
  }

  // Get training plan for a specific student
  async getTrainingPlan(studentId: string): Promise<any> {
    try {
      const rows = await this.fetchSheetData('TrainingPlans');
      // Find plan for specific student
      const planRow = rows.find(row => row[0] === studentId);
      
      if (planRow) {
        return {
          studentId: planRow[0],
          planData: JSON.parse(planRow[1] || '{}')
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching training plan:', error);
      return null;
    }
  }

  // Save training plan for a student
  async saveTrainingPlan(studentId: string, planData: any): Promise<void> {
    const newRow = [
      studentId,
      JSON.stringify(planData)
    ];

    await this.updateSheetData('TrainingPlans', 'A:B', [newRow]);
  }
}

// Export singleton instance
let sheetsService: GoogleSheetsService | null = null;

export const initializeGoogleSheets = (config: GoogleSheetsConfig) => {
  sheetsService = new GoogleSheetsService(config);
  return sheetsService;
};

export const getGoogleSheetsService = (): GoogleSheetsService => {
  if (!sheetsService) {
    throw new Error('Google Sheets service not initialized. Call initializeGoogleSheets first.');
  }
  return sheetsService;
};

export default GoogleSheetsService;