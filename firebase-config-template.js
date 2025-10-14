// 🔥 CONFIGURACIÓN DE FIREBASE PARA VASÍLALA
// Copia esta configuración desde tu nuevo proyecto Firebase

const firebaseConfig = {
  // 👇 REEMPLAZA ESTOS VALORES CON LOS DE TU NUEVO PROYECTO
  apiKey: "TU_API_KEY_AQUI",
  authDomain: "tu-proyecto.firebaseapp.com", 
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789"
};

// 📋 INSTRUCCIONES:
// 1. Ve a Firebase Console → Tu nuevo proyecto
// 2. Configuración del proyecto → General → Tus apps
// 3. Copia los valores de arriba
// 4. Reemplaza en src/lib/firebase.ts líneas 10-17

export default firebaseConfig;