# Wonder Gym Digital Planner

Una aplicación web moderna para la gestión de gimnasios, entrenadores y planes de entrenamiento, con integración a Google Sheets como backend.

## 🚀 Características

- **Dashboard** con estadísticas y actividades recientes
- **Gestión de Alumnos** con información completa
- **Gestión de Coaches** con especialidades y certificaciones
- **Planificador de Entrenamientos** personalizado
- **Integración con Google Sheets** como base de datos
- **Almacenamiento local** como respaldo
- **Interfaz responsive** con Tailwind CSS

## 🛠️ Tecnologías

- **React 18** con TypeScript
- **Vite** para desarrollo rápido
- **Tailwind CSS** para estilos
- **Lucide React** para iconos
- **Google Sheets API** como backend
- **localStorage** como respaldo

## 📋 Configuración de Google Sheets

### 1. Crear Google Sheets

Crea un nuevo Google Sheets con las siguientes hojas:

#### Hoja 1: "Students"
```
ID | Nombre | DiasEntrenamiento | CoachAsignado | FechaInicio | FechaFin | Email | Telefono | Nivel | Objetivos
```

#### Hoja 2: "Coaches"
```
ID | Nombre | Email | Telefono | Especialidad | Experiencia | Certificaciones | Activo
```

#### Hoja 3: "TrainingPlans"
```
StudentID | PlanData
```

### 2. Obtener API Key

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la **Google Sheets API**
4. Crea credenciales (API Key)
5. Configura las restricciones de la API Key

### 3. Configurar el proyecto

Edita el archivo `src/config/googleSheets.ts`:

```typescript
export const GOOGLE_SHEETS_CONFIG = {
  spreadsheetId: 'TU_SPREADSHEET_ID_AQUI',
  apiKey: 'TU_API_KEY_AQUI'
};
```

### 4. Hacer público el Google Sheets

1. Abre tu Google Sheets
2. Haz clic en "Compartir"
3. Cambia a "Cualquier persona con el enlace puede ver"
4. Copia el ID del spreadsheet desde la URL

## 🚀 Instalación y Uso

### Requisitos
- Node.js 16+
- npm

### Comandos

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Vista previa de producción
npm run preview
```

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── Dashboard.tsx    # Página principal
│   ├── StudentsPage.tsx # Gestión de alumnos
│   ├── CoachesPage.tsx  # Gestión de coaches
│   ├── WonderGymPlanner.tsx # Planificador
│   └── Sidebar.tsx      # Navegación
├── hooks/               # Custom hooks
│   └── useGoogleSheets.ts # Hook para Google Sheets
├── services/            # Servicios
│   └── googleSheetsService.ts # Servicio API
├── config/              # Configuración
│   └── googleSheets.ts  # Config de Google Sheets
├── App.tsx             # Componente principal
└── main.tsx            # Punto de entrada
```

## 🔄 Funcionamiento

### Modo Online (Google Sheets)
- Los datos se cargan desde Google Sheets
- Los cambios se sincronizan automáticamente
- Respaldo local automático

### Modo Offline (localStorage)
- Funciona sin conexión a internet
- Datos almacenados localmente
- Sincronización al reconectar

## 🎨 Características de UI

- **Diseño moderno** con gradientes y sombras
- **Iconos intuitivos** con Lucide React
- **Estados visuales** para conexión y carga
- **Formularios validados** con feedback
- **Tablas responsivas** con acciones
- **Modales elegantes** para edición

## 📊 Funcionalidades

### Dashboard
- Estadísticas de alumnos y coaches
- Actividades recientes
- Próximas sesiones
- Acciones rápidas

### Gestión de Alumnos
- Lista completa con búsqueda
- Formularios de creación/edición
- Asignación de coaches
- Acceso directo al planificador

### Gestión de Coaches
- Información profesional completa
- Especialidades y certificaciones
- Estados activo/inactivo
- Integración con asignaciones

### Planificador de Entrenamientos
- Rutinas por día de la semana
- Ejercicios con series y repeticiones
- Planes de cardio y abdomen
- Notas personalizadas
- Guardado automático

## 🔧 Personalización

### Colores de Marca
```css
:root {
  --wonder-red: #E53E3E;
  --wonder-dark: #1A202C;
  --wonder-gold: #F6E05E;
  --wonder-gray: #4A5568;
  --wonder-light-gray: #F7FAFC;
}
```

### Fuentes
- **Inter** - Texto general
- **Oswald** - Títulos y encabezados
- **Dancing Script** - Logo y elementos decorativos

## 📝 Licencia

Este proyecto es de uso privado para Wonder Gym.

## 🤝 Soporte

Para soporte técnico o preguntas sobre la implementación, contacta al equipo de desarrollo.