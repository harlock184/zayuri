// Google Sheets Configuration
export const GOOGLE_SHEETS_CONFIG = {
  // Replace with your actual Google Sheets ID
  // You can find this in the URL: https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
  spreadsheetId: 'YOUR_SPREADSHEET_ID_HERE',
  
  // Replace with your Google API Key
  // Get this from Google Cloud Console: https://console.cloud.google.com/
  apiKey: 'YOUR_API_KEY_HERE'
};

// Sheet structure that you need to create in Google Sheets:
/*
Sheet 1: "Students"
Headers (Row 1): ID | Nombre | DiasEntrenamiento | CoachAsignado | FechaInicio | FechaFin | Email | Telefono | Nivel | Objetivos

Sheet 2: "Coaches"
Headers (Row 1): ID | Nombre | Email | Telefono | Especialidad | Experiencia | Certificaciones | Activo

Sheet 3: "TrainingPlans"
Headers (Row 1): StudentID | PlanData

Make sure to:
1. Create these exact sheet names in your Google Sheets
2. Add the headers in Row 1 exactly as shown
3. Make the spreadsheet publicly readable or set up proper authentication
*/