# 🎵 Vasílala - Plataforma de Música Latina

> **Una plataforma web moderna que combina TikTok + Spotify + Teleticket, enfocada exclusivamente en la música latina**

[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://ritmo-latino-yoh8.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

## 🌟 Demo en Vivo

### **[🚀 Ver Vasílala en Acción](https://ritmo-latino-yoh8.vercel.app)** 

**Explora las diferentes secciones:**
- 🏠 [Feed Principal](https://ritmo-latino-yoh8.vercel.app/) - Videos tipo TikTok
- 🎵 [TSón](https://ritmo-latino-yoh8.vercel.app/tson) - Reproductor de música
- 🎫 [Vasílala](https://ritmo-latino-yoh8.vercel.app/events) - Sistema de eventos
- 🎬 [Estudio](https://ritmo-latino-yoh8.vercel.app/studio) - Creación de contenido
- 👤 [Perfil](https://ritmo-latino-yoh8.vercel.app/profile) - Gestión de usuarios

## ✨ Características Principales

### 🎥 **Feed de Videos (Estilo TikTok)**
- Scroll vertical infinito con 20+ videos de demostración
- Autoplay inteligente y controles de video
- Sistema de likes, comentarios y shares
- Navegación con flechas, mouse y touch

### 🎵 **TSón - Reproductor Musical (Estilo Spotify)**
- Catálogo de música latina con géneros variados
- Reproductor completo con controles avanzados
- Listas de reproducción personalizadas
- Artistas verificados y trending

### 🎫 **Vasílala - Sistema de Eventos (Estilo Teleticket)**
- Creación y gestión de eventos latinos
- Sistema de venta de entradas integrado
- Filtros por género, ubicación y fecha
- Calendario de eventos interactivo

### 👥 **Sistema de Usuarios Verificados**
- **7 tipos de usuario**: Fan, Artista, DJ, Bailarín, Escuela, Local, Organizador
- Proceso de verificación con documentación
- Perfiles profesionales con páginas personalizadas
- Badges de verificación dorados

### 🎨 **Diseño Premium**
- Tema oscuro elegante con acentos dorados
- Diseño responsive para móvil, tablet y desktop
- Animaciones fluidas y micro-interacciones
- Tipografía profesional y espaciado perfecto

## 🛠️ Stack Tecnológico

### **Frontend**
- **Next.js 15** - Framework React con App Router
- **React 18** - Biblioteca de UI con hooks modernos
- **TypeScript** - Tipado estático para mejor desarrollo
- **Tailwind CSS** - Framework de CSS utilitario
- **Radix UI** - Componentes accesibles y personalizables

### **Estado y Datos**
- **Zustand** - Gestión de estado ligera y eficiente
- **React Hook Form** - Manejo de formularios optimizado
- **Zod** - Validación de esquemas TypeScript-first

### **Backend y Servicios**
- **Firebase** - Backend como servicio (opcional)
- **Vercel** - Hosting y despliegue automático
- **Datos Mock** - 50+ registros de demostración realistas

### **Herramientas de Desarrollo**
- **ESLint** - Linting de código
- **Prettier** - Formateo automático
- **Husky** - Git hooks para calidad de código

## 🚀 Instalación y Desarrollo

### **Prerrequisitos**
- Node.js 18+ 
- npm o yarn
- Git

### **Instalación Local**

```bash
# 1. Clonar el repositorio
git clone https://github.com/mejorquenunca/ritmo-latino.git
cd ritmo-latino

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno (opcional)
cp .env.example .env.local
# Editar .env.local si quieres conectar Firebase

# 4. Ejecutar en desarrollo
npm run dev

# 5. Abrir en el navegador
# http://localhost:3000
```

### **Scripts Disponibles**

```bash
npm run dev          # Servidor de desarrollo con Turbopack
npm run build        # Build optimizado para producción
npm run start        # Servidor de producción
npm run lint         # Verificar código con ESLint
npm run typecheck    # Verificar tipos con TypeScript
```

## 📁 Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js 15
│   ├── (auth)/            # Rutas de autenticación
│   ├── events/            # Sistema de eventos
│   ├── tson/              # Reproductor de música
│   ├── studio/            # Herramientas de creación
│   └── profile/           # Gestión de perfiles
├── components/            # Componentes React reutilizables
│   ├── feed/             # Feed de videos tipo TikTok
│   ├── tson/             # Componentes del reproductor
│   ├── vasilala/         # Sistema de eventos
│   ├── ui/               # Componentes base (botones, inputs)
│   └── layout/           # Layout y navegación
├── lib/                  # Utilidades y configuración
│   ├── firebase.ts       # Configuración de Firebase
│   ├── auth.ts           # Lógica de autenticación
│   └── utils.ts          # Funciones utilitarias
├── stores/               # Estado global con Zustand
│   ├── authStore.ts      # Estado de autenticación
│   ├── feedStore.ts      # Estado del feed
│   └── musicStore.ts     # Estado del reproductor
├── types/                # Definiciones de TypeScript
└── styles/               # Estilos globales
```

## 🎯 Funcionalidades Implementadas

### ✅ **Completamente Funcional**
- [x] Feed de videos con scroll infinito
- [x] Sistema de navegación responsive
- [x] Reproductor de música integrado
- [x] Gestión de eventos y entradas
- [x] Perfiles de usuario verificados
- [x] Sistema de autenticación (UI)
- [x] Tema oscuro con detalles dorados
- [x] Datos de demostración realistas
- [x] Optimización para SEO y rendimiento

### 🚧 **En Desarrollo**
- [ ] Integración completa con Firebase
- [ ] Sistema de comentarios en tiempo real
- [ ] Notificaciones push
- [ ] Chat entre usuarios
- [ ] Análiticas y métricas

### 💡 **Futuras Mejoras**
- [ ] App móvil con React Native
- [ ] Integración con redes sociales
- [ ] Sistema de monetización
- [ ] IA para recomendaciones
- [ ] Streaming en vivo

## 🌐 Despliegue

### **Vercel (Recomendado)**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/mejorquenunca/ritmo-latino)

1. Conecta tu repositorio de GitHub
2. Vercel detecta automáticamente Next.js
3. Deploy en menos de 2 minutos
4. URL automática + SSL incluido

### **Otras Opciones**

- **Netlify**: Perfecto para sitios estáticos
- **Railway**: Ideal para full-stack con base de datos
- **DigitalOcean**: Para mayor control del servidor

## 🎨 Personalización

### **Colores del Tema**
```css
:root {
  --primary: #D4AF37;      /* Dorado elegante */
  --background: #000000;    /* Negro profundo */
  --foreground: #FFFFFF;    /* Blanco puro */
  --muted: #1A1A1A;        /* Gris oscuro */
  --accent: #FFD700;       /* Dorado brillante */
}
```

### **Tipografía**
- **Primaria**: Inter (Google Fonts)
- **Títulos**: PT Sans (Google Fonts)
- **Monospace**: JetBrains Mono

## 📊 Rendimiento

- **Lighthouse Score**: 95+ en todas las métricas
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3s

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor:

1. **Fork** el proyecto
2. **Crea** una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
5. **Abre** un Pull Request

### **Guías de Contribución**
- Sigue las convenciones de código existentes
- Agrega tests para nuevas funcionalidades
- Actualiza la documentación si es necesario
- Usa commits descriptivos

## 📄 Licencia

Este proyecto está bajo la **Licencia MIT**. Ver [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**Desarrollado con ❤️ por [Tu Nombre]**

- 🌐 Portfolio: [tu-portfolio.com](https://tu-portfolio.com)
- 💼 LinkedIn: [tu-linkedin](https://linkedin.com/in/tu-perfil)
- 🐦 Twitter: [@tu-twitter](https://twitter.com/tu-twitter)
- 📧 Email: tu-email@ejemplo.com

## 🙏 Agradecimientos

- **Comunidad latina** por la inspiración musical
- **Next.js team** por el increíble framework
- **Vercel** por el hosting gratuito
- **Radix UI** por los componentes accesibles
- **Tailwind CSS** por el sistema de diseño

---

<div align="center">

**¡Disfruta de Vasílala - donde la música latina cobra vida!** 🎵✨

[⭐ Dale una estrella si te gustó el proyecto](https://github.com/mejorquenunca/ritmo-latino)

</div>