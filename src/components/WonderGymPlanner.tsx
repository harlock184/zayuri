// import React, { useState, useEffect } from 'react';
// import { useCallback, memo } from 'react';
// import { Save, Calendar, User, Target, Dumbbell, ArrowLeft } from 'lucide-react';
// import { useGAS } from '../hooks/useGAS';

// interface ExerciseRow {
//   exercise: string;
//   series: string;
//   reps: string;
//   id?: string;
// }

// interface PlanData {
//   usuario: string;
//   inicioDelPlan: string;
//   duracion: string;
//   coach: string;
//   nivel: string;
//   frecuencia: string;
//   volumen: string;
//   intensidad: string;
//   objetivos: string;
//   diasEntrenamiento: {
//     L: boolean;
//     M: boolean;
//     Mi: boolean;
//     J: boolean;
//     V: boolean;
//     D: boolean;
//   };
//   rutinas: {
//     [key: string]: ExerciseRow[];
//   };
//   cardio: {
//     L: string;
//     M: string;
//     J: string;
//     Ju: string;
//     V: string;
//     S: string;
//   };
//   abdomen: string;
//   notas: string;
// }

// interface Student {
//   id: string;
//   nombre: string;
//   diasEntrenamiento: string;
//   coachAsignado: string;
//   fechaInicio: string;
//   fechaFin: string;
//   email?: string;
//   telefono?: string;
//   nivel?: string;
//   objetivos?: string;
// }

// interface WonderGymPlannerProps {
//   student?: Student;
//   onBack: () => void;
// }

// // Mover ExerciseSection fuera del componente principal y memoizarlo
// interface ExerciseSectionProps {
//   day: string;
//   exercises: ExerciseRow[];
//   onUpdateExercise: (day: string, index: number, field: string, value: string) => void;
//   onAddExerciseRow: (day: string) => void;
//   onRemoveExerciseRow: (day: string, index: number) => void;
// }

// const ExerciseSection = memo(({ day, exercises, onUpdateExercise, onAddExerciseRow, onRemoveExerciseRow }: ExerciseSectionProps) => (
//   <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
//     <h3 className="font-oswald font-bold text-gray-800 mb-3 text-lg uppercase tracking-wide">{day}</h3>
//     <div className="space-y-2">
//       <div className="grid grid-cols-12 gap-2 text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">
//         <div className="col-span-7">EJERCICIO:</div>
//         <div className="col-span-2 text-center">SERIES</div>
//         <div className="col-span-2 text-center">REPS.</div>
//         <div className="col-span-1"></div>
//       </div>
//       {exercises.map((row, index) => (
//         <div key={row.id || `${day}-${index}`} className="grid grid-cols-12 gap-2">
//           <input
//             type="text"
//             value={row.exercise}
//             onChange={(e) => onUpdateExercise(day, index, 'exercise', e.target.value)}
//             className="col-span-7 px-2 py-1 border-b-2 border-gray-300 focus:border-red-600 focus:outline-none text-sm transition-colors"
//             placeholder="Nombre del ejercicio"
//           />
//           <input
//             type="text"
//             value={row.series}
//             onChange={(e) => onUpdateExercise(day, index, 'series', e.target.value)}
//             className="col-span-2 px-2 py-1 border-b-2 border-gray-300 focus:border-red-600 focus:outline-none text-sm text-center transition-colors"
//             placeholder="3"
//           />
//           <input
//             type="text"
//             value={row.reps}
//             onChange={(e) => onUpdateExercise(day, index, 'reps', e.target.value)}
//             className="col-span-2 px-2 py-1 border-b-2 border-gray-300 focus:border-red-600 focus:outline-none text-sm text-center transition-colors"
//             placeholder="12"
//           />
//           <button
//             onClick={() => onRemoveExerciseRow(day, index)}
//             className="col-span-1 text-red-500 hover:text-red-700 text-lg font-bold hover:bg-red-50 rounded transition-colors"
//             disabled={exercises.length === 1}
//           >
//             ×
//           </button>
//         </div>
//       ))}
//       <button
//         onClick={() => onAddExerciseRow(day)}
//         className="text-red-600 hover:text-red-800 text-sm font-semibold mt-2 hover:bg-red-50 px-2 py-1 rounded transition-colors"
//       >
//         + Agregar ejercicio
//       </button>
//     </div>
//   </div>
// ));

// const WonderGymPlanner: React.FC<WonderGymPlannerProps> = ({ student, onBack }) => {
//   const [planData, setPlanData] = useState<PlanData>({
//     usuario: student?.nombre || '',
//     inicioDelPlan: '',
//     duracion: '',
//     coach: student?.coachAsignado || '',
//     nivel: student?.nivel || '',
//     frecuencia: '',
//     volumen: '',
//     intensidad: '',
//     objetivos: student?.objetivos || '',
//     diasEntrenamiento: {
//       L: false,
//       M: false,
//       Mi: false,
//       J: false,
//       V: false,
//       D: false,
//     },
//     rutinas: {
//       LUNES: [{ exercise: '', series: '', reps: '', id: 'lunes-1' }],
//       MARTES: [{ exercise: '', series: '', reps: '', id: 'martes-1' }],
//       MIÉRCOLES: [{ exercise: '', series: '', reps: '', id: 'miercoles-1' }],
//       JUEVES: [{ exercise: '', series: '', reps: '', id: 'jueves-1' }],
//       VIERNES: [{ exercise: '', series: '', reps: '', id: 'viernes-1' }],
//       SÁBADO: [{ exercise: '', series: '', reps: '', id: 'sabado-1' }],
//     },
//     cardio: {
//       L: '',
//       M: '',
//       J: '',
//       Ju: '',
//       V: '',
//       S: '',
//     },
//     abdomen: '',
//     notas: '',
//   });

//   // Use Google Sheets hook
//   const {
//     coaches,
//     loadCoaches,
//     loadTrainingPlan,
//     saveTrainingPlan
//   } = useGAS();

//   // Load data from localStorage on component mount
//   useEffect(() => {
//     loadCoaches();

//     const loadPlanData = async () => {
//       if (student) {
//         try {
//           const savedData = await loadTrainingPlan(student.id);
//           console.log('Loading plan for student:', student.nombre);

//           if (savedData) {
//             setPlanData(savedData);
//             console.log('Plan loaded successfully');
//           } else {
//             // Initialize with student data if no plan exists
//             setPlanData(prev => ({
//               ...prev,
//               usuario: student.nombre,
//               coach: student.coachAsignado,
//               nivel: student.nivel || '',
//               objetivos: student.objetivos || '',
//               inicioDelPlan: student.fechaInicio || '',
//             }));
//           }
//         } catch (error) {
//           console.error('Error loading training plan:', error);
//           // Initialize with student data on error
//           setPlanData(prev => ({
//             ...prev,
//             usuario: student.nombre,
//             coach: student.coachAsignado,
//             nivel: student.nivel || '',
//             objetivos: student.objetivos || '',
//             inicioDelPlan: student.fechaInicio || '',
//           }));
//         }
//       }
//     };

//     loadPlanData();
//   }, [student]);

//   // Save data to localStorage
//   const saveData = async () => {
//     try {
//       const saveButton = document.querySelector('[data-save-button]') as HTMLButtonElement;
//       if (saveButton) {
//         saveButton.disabled = true;
//         saveButton.innerHTML = '⏳ Guardando...';
//       }

//       if (student) {
//         await saveTrainingPlan(student.id, planData);
//         console.log('Plan saved for student:', student.nombre);
//       } else {
//         // For standalone planner without student
//         await saveTrainingPlan('default_plan', planData);
//         console.log('Default plan saved');
//       }

//       // Show success message
//       const successMessage = document.createElement('div');
//       successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
//       successMessage.textContent = '✅ Plan guardado exitosamente';
//       document.body.appendChild(successMessage);

//       setTimeout(() => {
//         document.body.removeChild(successMessage);
//       }, 3000);

//     } catch (error) {
//       console.error('Error saving training plan:', error);

//       // Show error message
//       const errorMessage = document.createElement('div');
//       errorMessage.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
//       errorMessage.textContent = '❌ Error al guardar. Intenta de nuevo.';
//       document.body.appendChild(errorMessage);

//       setTimeout(() => {
//         document.body.removeChild(errorMessage);
//       }, 3000);
//     } finally {
//       const saveButton = document.querySelector('[data-save-button]') as HTMLButtonElement;
//       if (saveButton) {
//         saveButton.disabled = false;
//         saveButton.innerHTML = '💾 Guardar';
//       }
//     }
//   };

//   const updateBasicInfo = (field: string, value: string | boolean) => {
//     setPlanData(prev => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const updateTrainingDays = (day: string, checked: boolean) => {
//     setPlanData(prev => ({
//       ...prev,
//       diasEntrenamiento: {
//         ...prev.diasEntrenamiento,
//         [day]: checked,
//       },
//     }));
//   };

//   const updateExercise = useCallback((day: string, index: number, field: string, value: string) => {
//     setPlanData(prev => ({
//       ...prev,
//       rutinas: {
//         ...prev.rutinas,
//         [day]: prev.rutinas[day].map((row, i) =>
//           i === index ? { ...row, [field]: value } : row
//         ),
//       },
//     }));
//   }, []);

//   const addExerciseRow = useCallback((day: string) => {
//     setPlanData(prev => ({
//       ...prev,
//       rutinas: {
//         ...prev.rutinas,
//         [day]: [...prev.rutinas[day], { exercise: '', series: '', reps: '', id: Date.now().toString() }],
//       },
//     }));
//   }, []);

//   const removeExerciseRow = useCallback((day: string, index: number) => {
//     setPlanData(prev => {
//       if (prev.rutinas[day].length > 1) {
//         return {
//           ...prev,
//           rutinas: {
//             ...prev.rutinas,
//             [day]: prev.rutinas[day].filter((_, i) => i !== index),
//           },
//         };
//       }
//       return prev;
//     });
//   }, []);

//   const updateCardio = (day: string, value: string) => {
//     setPlanData(prev => ({
//       ...prev,
//       cardio: {
//         ...prev.cardio,
//         [day]: value,
//       },
//     }));
//   };

//   // Get active coaches for dropdown
//   const activeCoaches = coaches.filter(coach => coach.activo);

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-6">
//           <div className="flex items-center justify-between mb-6">
//             <div className="flex items-center space-x-4">
//               <button
//                 onClick={onBack}
//                 className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
//                 title="Volver a Alumnos"
//               >
//                 <ArrowLeft size={20} />
//               </button>
//               <div className="flex items-center space-x-2">
//                 <Dumbbell className="text-red-600" size={24} />
//                 <div>
//                   <div className="font-script text-3xl text-gray-800">planner</div>
//                   {student && (
//                     <div className="text-sm text-gray-600">Plan para: {student.nombre}</div>
//                   )}
//                 </div>
//               </div>
//             </div>
//             <button
//               onClick={saveData}
//               data-save-button
//               className="wonder-gradient hover:shadow-lg text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-200 font-semibold"
//             >
//               <Save size={16} />
//               <span>Guardar</span>
//             </button>
//           </div>

//           {/* Basic Information */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
//             <div className="lg:col-span-2 space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-1">
//                     <User size={16} className="inline mr-1" />
//                     USUARIO:
//                   </label>
//                   <input
//                     type="text"
//                     value={planData.usuario}
//                     onChange={(e) => updateBasicInfo('usuario', e.target.value)}
//                     className="w-full px-3 py-2 border-b-2 border-gray-300 focus:border-red-600 focus:outline-none transition-colors"
//                     placeholder="Nombre del usuario"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-1">
//                     <Calendar size={16} className="inline mr-1" />
//                     INICIO DEL PLAN:
//                   </label>
//                   <input
//                     type="date"
//                     value={planData.inicioDelPlan}
//                     onChange={(e) => updateBasicInfo('inicioDelPlan', e.target.value)}
//                     className="w-full px-3 py-2 border-b-2 border-gray-300 focus:border-red-600 focus:outline-none transition-colors"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-1">DURACIÓN:</label>
//                   <input
//                     type="text"
//                     value={planData.duracion}
//                     onChange={(e) => updateBasicInfo('duracion', e.target.value)}
//                     className="w-full px-3 py-2 border-b-2 border-gray-300 focus:border-red-600 focus:outline-none transition-colors"
//                     placeholder="8 semanas"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-1">COACH:</label>
//                   <select
//                     value={planData.coach}
//                     onChange={(e) => updateBasicInfo('coach', e.target.value)}
//                     className="w-full px-3 py-2 border-b-2 border-gray-300 focus:border-red-600 focus:outline-none transition-colors"
//                   >
//                     <option value="">Seleccionar coach...</option>
//                     {activeCoaches.map((coach) => (
//                       <option key={coach.id} value={coach.nombre}>
//                         {coach.nombre} - {coach.especialidad}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">DÍAS DE ENTRENAMIENTO:</label>
//                 <div className="flex space-x-4">
//                   {Object.entries(planData.diasEntrenamiento).map(([day, checked]) => (
//                     <label key={day} className="flex items-center space-x-1">
//                       <input
//                         type="checkbox"
//                         checked={checked}
//                         onChange={(e) => updateTrainingDays(day, e.target.checked)}
//                         className="rounded border-gray-300 text-red-600 focus:ring-red-500 w-4 h-4"
//                       />
//                       <span className="text-sm font-semibold text-gray-700">{day}</span>
//                     </label>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200">
//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Nivel</label>
//                   <input
//                     type="text"
//                     value={planData.nivel}
//                     onChange={(e) => updateBasicInfo('nivel', e.target.value)}
//                     className="w-full px-2 py-1 text-sm border-b-2 border-gray-300 focus:border-red-600 focus:outline-none bg-transparent transition-colors"
//                     placeholder="Principiante"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Frecuencia</label>
//                   <input
//                     type="text"
//                     value={planData.frecuencia}
//                     onChange={(e) => updateBasicInfo('frecuencia', e.target.value)}
//                     className="w-full px-2 py-1 text-sm border-b-2 border-gray-300 focus:border-red-600 focus:outline-none bg-transparent transition-colors"
//                     placeholder="3x semana"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Volumen</label>
//                   <input
//                     type="text"
//                     value={planData.volumen}
//                     onChange={(e) => updateBasicInfo('volumen', e.target.value)}
//                     className="w-full px-2 py-1 text-sm border-b-2 border-gray-300 focus:border-red-600 focus:outline-none bg-transparent transition-colors"
//                     placeholder="Medio"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Intensidad</label>
//                   <input
//                     type="text"
//                     value={planData.intensidad}
//                     onChange={(e) => updateBasicInfo('intensidad', e.target.value)}
//                     className="w-full px-2 py-1 text-sm border-b-2 border-gray-300 focus:border-red-600 focus:outline-none bg-transparent transition-colors"
//                     placeholder="Moderada"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               <Target size={16} className="inline mr-1" />
//               OBJETIVOS:
//             </label>
//             <textarea
//               value={planData.objetivos}
//               onChange={(e) => updateBasicInfo('objetivos', e.target.value)}
//               className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:outline-none resize-none transition-colors"
//               rows={3}
//               placeholder="Describe los objetivos del plan de entrenamiento..."
//             />
//           </div>
//         </div>

//         {/* Exercise Sections */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
//           {Object.keys(planData.rutinas).map(day => (
//             <ExerciseSection
//               key={day}
//               day={day}
//               exercises={planData.rutinas[day]}
//               onUpdateExercise={updateExercise}
//               onAddExerciseRow={addExerciseRow}
//               onRemoveExerciseRow={removeExerciseRow}
//             />
//           ))}
//         </div>

//         {/* Bottom Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
//           {/* Cardio */}
//           <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
//             <h3 className="font-oswald font-bold text-gray-800 mb-3 uppercase tracking-wide">CARDIO</h3>
//             <div className="grid grid-cols-2 gap-2">
//               {Object.entries(planData.cardio).map(([day, value]) => (
//                 <div key={day}>
//                   <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">{day}</label>
//                   <input
//                     type="text"
//                     value={value}
//                     onChange={(e) => updateCardio(day, e.target.value)}
//                     className="w-full px-2 py-1 text-sm border-b-2 border-gray-300 focus:border-red-600 focus:outline-none transition-colors"
//                     placeholder="30 min"
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Abdomen */}
//           <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
//             <h3 className="font-oswald font-bold text-gray-800 mb-3 uppercase tracking-wide">ABDOMEN</h3>
//             <textarea
//               value={planData.abdomen}
//               onChange={(e) => updateBasicInfo('abdomen', e.target.value)}
//               className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:outline-none resize-none transition-colors"
//               rows={4}
//               placeholder="Rutina de abdomen..."
//             />
//           </div>

//           {/* Notes */}
//           <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
//             <h3 className="font-oswald font-bold text-gray-800 mb-3 uppercase tracking-wide">NOTAS</h3>
//             <textarea
//               value={planData.notas}
//               onChange={(e) => updateBasicInfo('notas', e.target.value)}
//               className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:outline-none resize-none transition-colors"
//               rows={4}
//               placeholder="Notas adicionales..."
//             />
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default WonderGymPlanner;

import React, { useState, useEffect, useCallback, memo } from 'react';
import { Save, Calendar, User, Target, Dumbbell, ArrowLeft } from 'lucide-react';
import { useGAS } from '../hooks/useGAS';

interface ExerciseRow {
  exercise: string;
  series: string;
  reps: string;
  id?: string;
}

interface PlanData {
  usuario: string;
  inicioDelPlan: string;   // siempre YYYY-MM-DD
  duracion: string;
  coach: string;
  nivel: string;
  frecuencia: string;
  volumen: string;
  intensidad: string;
  objetivos: string;
  diasEntrenamiento: {
    L: boolean; M: boolean; Mi: boolean; J: boolean; V: boolean; D: boolean;
  };
  rutinas: { [key: string]: ExerciseRow[] };
  cardio: { L: string; M: string; J: string; Ju: string; V: string; S: string };
  abdomen: string;
  notas: string;
}

interface Student {
  id: string;
  nombre: string;
  diasEntrenamiento: string;
  coachAsignado: string;
  fechaInicio: string;   // puede venir en ISO
  fechaFin: string;
  email?: string;
  telefono?: string;
  nivel?: string;
  objetivos?: string;
}

interface WonderGymPlannerProps {
  student?: Student;
  onBack: () => void;
}

/** Normaliza a YYYY-MM-DD (lo que espera <input type="date">) */
const toYMD = (v?: string) => (v ? String(v).split('T')[0] : '');

/** Sección de ejercicios memoizada */
interface ExerciseSectionProps {
  day: string;
  exercises: ExerciseRow[];
  onUpdateExercise: (day: string, index: number, field: string, value: string) => void;
  onAddExerciseRow: (day: string) => void;
  onRemoveExerciseRow: (day: string, index: number) => void;
}

const ExerciseSection = memo(
  ({ day, exercises, onUpdateExercise, onAddExerciseRow, onRemoveExerciseRow }: ExerciseSectionProps) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="font-oswald font-bold text-gray-800 mb-3 text-lg uppercase tracking-wide">{day}</h3>
      <div className="space-y-2">
        <div className="grid grid-cols-12 gap-2 text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">
          <div className="col-span-7">EJERCICIO:</div>
          <div className="col-span-2 text-center">SERIES</div>
          <div className="col-span-2 text-center">REPS.</div>
          <div className="col-span-1"></div>
        </div>
        {exercises.map((row, index) => (
          <div key={row.id || `${day}-${index}`} className="grid grid-cols-12 gap-2">
            <input
              type="text"
              value={row.exercise}
              onChange={(e) => onUpdateExercise(day, index, 'exercise', e.target.value)}
              className="col-span-7 px-2 py-1 border-b-2 border-gray-300 focus:border-red-600 focus:outline-none text-sm transition-colors"
              placeholder="Nombre del ejercicio"
            />
            <input
              type="text"
              value={row.series}
              onChange={(e) => onUpdateExercise(day, index, 'series', e.target.value)}
              className="col-span-2 px-2 py-1 border-b-2 border-gray-300 focus:border-red-600 focus:outline-none text-sm text-center transition-colors"
              placeholder="3"
            />
            <input
              type="text"
              value={row.reps}
              onChange={(e) => onUpdateExercise(day, index, 'reps', e.target.value)}
              className="col-span-2 px-2 py-1 border-b-2 border-gray-300 focus:border-red-600 focus:outline-none text-sm text-center transition-colors"
              placeholder="12"
            />
            <button
              onClick={() => onRemoveExerciseRow(day, index)}
              className="col-span-1 text-red-500 hover:text-red-700 text-lg font-bold hover:bg-red-50 rounded transition-colors"
              disabled={exercises.length === 1}
            >
              ×
            </button>
          </div>
        ))}
        <button
          onClick={() => onAddExerciseRow(day)}
          className="text-red-600 hover:text-red-800 text-sm font-semibold mt-2 hover:bg-red-50 px-2 py-1 rounded transition-colors"
        >
          + Agregar ejercicio
        </button>
      </div>
    </div>
  )
);

const WonderGymPlanner: React.FC<WonderGymPlannerProps> = ({ student, onBack }) => {
  const [planData, setPlanData] = useState<PlanData>({
    usuario: student?.nombre || '',
    inicioDelPlan: '',
    duracion: '',
    coach: student?.coachAsignado || '',
    nivel: student?.nivel || '',
    frecuencia: '',
    volumen: '',
    intensidad: '',
    objetivos: student?.objetivos || '',
    diasEntrenamiento: { L: false, M: false, Mi: false, J: false, V: false, D: false },
    rutinas: {
      LUNES: [{ exercise: '', series: '', reps: '', id: 'lunes-1' }],
      MARTES: [{ exercise: '', series: '', reps: '', id: 'martes-1' }],
      MIÉRCOLES: [{ exercise: '', series: '', reps: '', id: 'miercoles-1' }],
      JUEVES: [{ exercise: '', series: '', reps: '', id: 'jueves-1' }],
      VIERNES: [{ exercise: '', series: '', reps: '', id: 'viernes-1' }],
      SÁBADO: [{ exercise: '', series: '', reps: '', id: 'sabado-1' }],
    },
    cardio: { L: '', M: '', J: '', Ju: '', V: '', S: '' },
    abdomen: '',
    notas: '',
  });

  const { coaches, loadCoaches, loadTrainingPlan, saveTrainingPlan } = useGAS();

  /** Carga inicial */
  useEffect(() => {
    loadCoaches();

    const loadPlanData = async () => {
      if (!student) return;

      try {
        const savedData = await loadTrainingPlan(student.id);
        console.log('Loading plan for student:', student.nombre);

        if (savedData) {
          setPlanData({
            ...savedData,
            inicioDelPlan: toYMD(savedData.inicioDelPlan),
          });
          console.log('Plan loaded successfully');
        } else {
          setPlanData((prev) => ({
            ...prev,
            usuario: student.nombre,
            coach: student.coachAsignado,
            nivel: student.nivel || '',
            objetivos: student.objetivos || '',
            inicioDelPlan: toYMD(student.fechaInicio),
          }));
        }
      } catch (error) {
        console.error('Error loading training plan:', error);
        setPlanData((prev) => ({
          ...prev,
          usuario: student.nombre,
          coach: student.coachAsignado,
          nivel: student.nivel || '',
          objetivos: student.objetivos || '',
          inicioDelPlan: toYMD(student.fechaInicio),
        }));
      }
    };

    loadPlanData();
  }, [student, loadCoaches, loadTrainingPlan]);

  /** Guardar */
  const saveData = async () => {
    try {
      const saveButton = document.querySelector('[data-save-button]') as HTMLButtonElement | null;
      if (saveButton) {
        saveButton.disabled = true;
        saveButton.innerHTML = '⏳ Guardando...';
      }

      // Asegura el formato de fecha antes de enviar
      const payload: PlanData = { ...planData, inicioDelPlan: toYMD(planData.inicioDelPlan) };

      if (student) {
        await saveTrainingPlan(student.id, payload);
        console.log('Plan saved for student:', student.nombre);
      } else {
        await saveTrainingPlan('default_plan', payload);
        console.log('Default plan saved');
      }

      const successMessage = document.createElement('div');
      successMessage.className =
        'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      successMessage.textContent = '✅ Plan guardado exitosamente';
      document.body.appendChild(successMessage);
      setTimeout(() => document.body.removeChild(successMessage), 3000);
    } catch (error) {
      console.error('Error saving training plan:', error);
      const errorMessage = document.createElement('div');
      errorMessage.className =
        'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      errorMessage.textContent = '❌ Error al guardar. Intenta de nuevo.';
      document.body.appendChild(errorMessage);
      setTimeout(() => document.body.removeChild(errorMessage), 3000);
    } finally {
      const saveButton = document.querySelector('[data-save-button]') as HTMLButtonElement | null;
      if (saveButton) {
        saveButton.disabled = false;
        saveButton.innerHTML = '💾 Guardar';
      }
    }
  };

  /** Updaters */
  const updateBasicInfo = (field: keyof PlanData, value: any) => {
    setPlanData((prev) => ({ ...prev, [field]: value }));
  };

  const updateTrainingDays = (day: keyof PlanData['diasEntrenamiento'], checked: boolean) => {
    setPlanData((prev) => ({
      ...prev,
      diasEntrenamiento: { ...prev.diasEntrenamiento, [day]: checked },
    }));
  };

  const updateExercise = useCallback(
    (day: string, index: number, field: string, value: string) => {
      setPlanData((prev) => ({
        ...prev,
        rutinas: {
          ...prev.rutinas,
          [day]: prev.rutinas[day].map((row, i) => (i === index ? { ...row, [field]: value } : row)),
        },
      }));
    },
    []
  );

  const addExerciseRow = useCallback((day: string) => {
    setPlanData((prev) => ({
      ...prev,
      rutinas: {
        ...prev.rutinas,
        [day]: [...prev.rutinas[day], { exercise: '', series: '', reps: '', id: Date.now().toString() }],
      },
    }));
  }, []);

  const removeExerciseRow = useCallback((day: string, index: number) => {
    setPlanData((prev) => {
      if (prev.rutinas[day].length > 1) {
        return {
          ...prev,
          rutinas: { ...prev.rutinas, [day]: prev.rutinas[day].filter((_, i) => i !== index) },
        };
      }
      return prev;
    });
  }, []);

  const updateCardio = (day: keyof PlanData['cardio'], value: string) => {
    setPlanData((prev) => ({ ...prev, cardio: { ...prev.cardio, [day]: value } }));
  };

  const activeCoaches = (coaches || []).filter((c) => c.activo);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Volver a Alumnos"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="flex items-center space-x-2">
                <Dumbbell className="text-red-600" size={24} />
                <div>
                  <div className="font-script text-3xl text-gray-800">planner</div>
                  {student && <div className="text-sm text-gray-600">Plan para: {student.nombre}</div>}
                </div>
              </div>
            </div>
            <button
              onClick={saveData}
              data-save-button
              className="wonder-gradient hover:shadow-lg text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-200 font-semibold"
            >
              <Save size={16} />
              <span>Guardar</span>
            </button>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    <User size={16} className="inline mr-1" />
                    USUARIO:
                  </label>
                  <input
                    type="text"
                    value={planData.usuario}
                    onChange={(e) => updateBasicInfo('usuario', e.target.value)}
                    className="w-full px-3 py-2 border-b-2 border-gray-300 focus:border-red-600 focus:outline-none transition-colors"
                    placeholder="Nombre del usuario"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    <Calendar size={16} className="inline mr-1" />
                    INICIO DEL PLAN:
                  </label>
                  <input
                    type="date"
                    value={planData.inicioDelPlan ? planData.inicioDelPlan.split('T')[0] : ''} // forzado a YYYY-MM-DD
                    onChange={(e) => updateBasicInfo('inicioDelPlan', e.target.value)}
                    className="w-full px-3 py-2 border-b-2 border-gray-300 focus:border-red-600 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">DURACIÓN:</label>
                  <input
                    type="text"
                    value={planData.duracion}
                    onChange={(e) => updateBasicInfo('duracion', e.target.value)}
                    className="w-full px-3 py-2 border-b-2 border-gray-300 focus:border-red-600 focus:outline-none transition-colors"
                    placeholder="8 semanas"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">COACH:</label>
                  <select
                    value={planData.coach}
                    onChange={(e) => updateBasicInfo('coach', e.target.value)}
                    className="w-full px-3 py-2 border-b-2 border-gray-300 focus:border-red-600 focus:outline-none transition-colors"
                  >
                    <option value="">Seleccionar coach...</option>
                    {activeCoaches.map((coach) => (
                      <option key={coach.id} value={coach.nombre}>
                        {coach.nombre} - {coach.especialidad}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">DÍAS DE ENTRENAMIENTO:</label>
                <div className="flex space-x-4">
                  {Object.entries(planData.diasEntrenamiento).map(([day, checked]) => (
                    <label key={day} className="flex items-center space-x-1">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => updateTrainingDays(day as any, e.target.checked)}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500 w-4 h-4"
                      />
                      <span className="text-sm font-semibold text-gray-700">{day}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Nivel</label>
                  <input
                    type="text"
                    value={planData.nivel}
                    onChange={(e) => updateBasicInfo('nivel', e.target.value)}
                    className="w-full px-2 py-1 text-sm border-b-2 border-gray-300 focus:border-red-600 focus:outline-none bg-transparent transition-colors"
                    placeholder="Principiante"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Frecuencia</label>
                  <input
                    type="text"
                    value={planData.frecuencia}
                    onChange={(e) => updateBasicInfo('frecuencia', e.target.value)}
                    className="w-full px-2 py-1 text-sm border-b-2 border-gray-300 focus:border-red-600 focus:outline-none bg-transparent transition-colors"
                    placeholder="3x semana"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Volumen</label>
                  <input
                    type="text"
                    value={planData.volumen}
                    onChange={(e) => updateBasicInfo('volumen', e.target.value)}
                    className="w-full px-2 py-1 text-sm border-b-2 border-gray-300 focus:border-red-600 focus:outline-none bg-transparent transition-colors"
                    placeholder="Medio"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Intensidad</label>
                  <input
                    type="text"
                    value={planData.intensidad}
                    onChange={(e) => updateBasicInfo('intensidad', e.target.value)}
                    className="w-full px-2 py-1 text-sm border-b-2 border-gray-300 focus:border-red-600 focus:outline-none bg-transparent transition-colors"
                    placeholder="Moderada"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Target size={16} className="inline mr-1" />
              OBJETIVOS:
            </label>
            <textarea
              value={planData.objetivos}
              onChange={(e) => updateBasicInfo('objetivos', e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:outline-none resize-none transition-colors"
              rows={3}
              placeholder="Describe los objetivos del plan de entrenamiento..."
            />
          </div>
        </div>

        {/* Exercise Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
          {Object.keys(planData.rutinas).map((day) => (
            <ExerciseSection
              key={day}
              day={day}
              exercises={planData.rutinas[day]}
              onUpdateExercise={updateExercise}
              onAddExerciseRow={addExerciseRow}
              onRemoveExerciseRow={removeExerciseRow}
            />
          ))}
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Cardio */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-oswald font-bold text-gray-800 mb-3 uppercase tracking-wide">CARDIO</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(planData.cardio).map(([day, value]) => (
                <div key={day}>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">{day}</label>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => updateCardio(day as any, e.target.value)}
                    className="w-full px-2 py-1 text-sm border-b-2 border-gray-300 focus:border-red-600 focus:outline-none transition-colors"
                    placeholder="30 min"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Abdomen */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-oswald font-bold text-gray-800 mb-3 uppercase tracking-wide">ABDOMEN</h3>
            <textarea
              value={planData.abdomen}
              onChange={(e) => updateBasicInfo('abdomen', e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:outline-none resize-none transition-colors"
              rows={4}
              placeholder="Rutina de abdomen..."
            />
          </div>

          {/* Notes */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-oswald font-bold text-gray-800 mb-3 uppercase tracking-wide">NOTAS</h3>
            <textarea
              value={planData.notas}
              onChange={(e) => updateBasicInfo('notas', e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:outline-none resize-none transition-colors"
              rows={4}
              placeholder="Notas adicionales..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WonderGymPlanner;
