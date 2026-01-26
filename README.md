# DanceFlow Mobile

Aplicación móvil para la plataforma de gestión de academias de baile DanceFlow.

## 🚀 Tecnologías

- **React Native** con Expo
- **TypeScript**
- **Ant Design Mobile RN**
- **React Navigation**
- **Axios** para API calls
- **Expo Secure Store** para almacenamiento seguro

## 📋 Requisitos

- Node.js 16 o superior
- npm o yarn
- Expo CLI (opcional, está incluido en las dependencias)

## 🛠️ Instalación

1. Instalar dependencias:

```bash
npm install
```

2. Configurar variables de entorno:
    - Copiar `.env.example` a `.env`
    - Configurar `API_BASE_URL` con tu endpoint de backend

## 🏃 Ejecución

### Modo desarrollo con Expo Go

```bash
npm start
```

Luego escanea el código QR con la app Expo Go en tu dispositivo móvil.

### Plataformas específicas

```bash
# iOS
npm run ios

# Android
npm run android

# Web (preview)
npm run web
```

## 📱 Características Implementadas (Fase 1)

### ✅ Pantalla de Login

- Slider de imágenes de bailarines (40% superior)
- Formulario con overlay en card redondeado
- Validación de email y contraseña
- Toggle de visibilidad de contraseña
- Opción "Recordar por 30 días"
- Link "Olvidé mi contraseña"

### ✅ Sistema de Temas

- Soporte para Light y Dark mode
- Paleta de colores Electric Blue
- Alto contraste en modo Light
- Persistencia de preferencia de tema

### ✅ Autenticación

- Integración con endpoint `/auth/login`
- Almacenamiento seguro de JWT token
- Manejo de sesiones y token expiry
- Multi-tenancy (preparado para academias)

### ✅ Diseño Responsivo

- SafeArea para dispositivos con notch
- Diseño adaptable a diferentes tamaños de pantalla
- Soporte para teclado (KeyboardAvoidingView)

## 🎨 Paleta de Colores

### Light Mode

- Primary: `#0ea5e9` (Electric Blue)
- Background: `#ffffff`
- Surface: `#f9fafb`
- Text Primary: `#111827`
- Text Secondary: `#4b5563`

### Dark Mode

- Primary: `#0ea5e9` (Electric Blue)
- Background: `#0f172a`
- Surface: `#1e293b`
- Text Primary: `#f1f5f9`
- Text Secondary: `#cbd5e1`

## 📁 Estructura del Proyecto

```
src/
├── components/       # Componentes reutilizables
├── screens/         # Pantallas de la app
├── navigation/      # Configuración de navegación
├── services/        # Servicios de API
├── contexts/        # Contextos de React
├── hooks/           # Hooks personalizados
├── theme/           # Configuración de temas
├── utils/           # Utilidades
├── assets/          # Imágenes, fuentes
└── types/           # Tipos de TypeScript
```

## 🔐 Seguridad

- JWT tokens almacenados en **Expo Secure Store** (almacenamiento encriptado)
- Validación de inputs en cliente
- Manejo de errores de autenticación
- Auto-logout en caso de token expirado

## 🚧 Próximas Fases

- Dashboard principal
- Gestión de estudiantes
- Programación de clases
- Pagos y planes
- Notificaciones push
- Y más...

## 📄 Licencia

Propiedad de DanceFlow © 2026
