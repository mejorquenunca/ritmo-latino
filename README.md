# 🎵 Vasílala - Ritmo Latino

Una plataforma de red social dedicada a la música latina, combinando las mejores características de TikTok, Spotify y Teleticket.

## 🌟 Características

- **Feed de Videos**: Contenido vertical tipo TikTok con música latina
- **TSón**: Reproductor de música estilo Spotify
- **Vasílala**: Sistema de eventos y venta de entradas
- **Perfiles Verificados**: Artistas, DJs, academias y más
- **Tema Oscuro**: Diseño elegante con detalles dorados

## 🚀 Despliegue Rápido

### Opción 1: Vercel (Recomendado)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tu-usuario/ritmo-latino)

### Opción 2: Netlify
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/tu-usuario/ritmo-latino)

## 🛠️ Instalación Local

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/ritmo-latino.git
cd ritmo-latino

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales de Firebase

# Ejecutar en desarrollo
npm run dev
```

## 📱 Tecnologías

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Backend**: Firebase (Firestore, Auth, Storage)
- **Estado**: Zustand
- **Formularios**: React Hook Form + Zod

## 🎯 Estructura del Proyecto

```
src/
├── app/                 # App Router de Next.js
├── components/          # Componentes React
│   ├── feed/           # Componentes del feed
│   ├── tson/           # Reproductor de música
│   ├── vasilala/       # Sistema de eventos
│   └── ui/             # Componentes base
├── lib/                # Utilidades y configuración
├── stores/             # Estado global (Zustand)
└── types/              # Definiciones de TypeScript
```

## 🌐 URLs de Demostración

- **Feed Principal**: `/`
- **Música (TSón)**: `/tson`
- **Eventos (Vasílala)**: `/events`
- **Estudio**: `/studio`
- **Perfil**: `/profile`

## 🔧 Variables de Entorno

Copia `.env.example` a `.env.local` y configura:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
# ... más configuraciones
```

## 📦 Scripts Disponibles

```bash
npm run dev          # Desarrollo con Turbopack
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linting
npm run typecheck    # Verificación de tipos
```

## 🎨 Personalización

### Colores del Tema
- **Primario**: Dorado (#D4AF37)
- **Fondo**: Negro profundo (#000000)
- **Texto**: Blanco (#FFFFFF)
- **Acentos**: Grises oscuros

### Fuentes
- **Principal**: Inter (sistema)
- **Títulos**: PT Sans

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🎵 Créditos

Desarrollado con ❤️ para la comunidad latina de música y baile.

---

**¡Disfruta de Vasílala - donde la música latina cobra vida!** 🎊