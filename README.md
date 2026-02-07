# Manage My Money (Mobile)

Una aplicación móvil moderna para la gestión de finanzas personales, construida con React Native y Expo. Esta app complementa la versión web existente, permitiendo a los usuarios rastrear gastos, ingresos y presupuestos desde cualquier lugar.

## 📱 Características Principales

- **Dashboard Interactivo**: Visualización clara de ingresos, gastos y balance neto del mes actual.
- **Gestión de Transacciones**: Listado de movimientos recientes con detalles de categorías y cuentas.
- **Autenticación Segura**: Login y Registro completo con persistencia de sesión segura (SecureStore).
- **Diseño Adaptativo**: UI limpia y moderna con soporte para Tema Claro/Oscuro.
- **Navegación Intuitiva**: Sistema de pestañas (Tabs) para acceso rápido a las secciones principales.

## 🛠️ Tecnologías

- **Core**: React Native, Expo Router
- **Lenguaje**: TypeScript
- **Estado Global**: React Context API
- **Cliente HTTP**: Axios (con interceptores para JWT)
- **Almacenamiento**: Expo Secure Store
- **UI**: Componentes temáticos personalizados, Expo Vector Icons

## 🚀 Comenzar

1. **Instalar dependencias**

   ```bash
   npm install
   ```

2. **Configurar el backend**
   Asegúrate de que la API de `ManageMyMoneyApi` esté ejecutándose localmente o actualiza la URL en `constants/Config.ts`.

3. **Ejecutar la aplicación**

   ```bash
   npx expo start
   ```

4. **Probar en dispositivo**
   - Escanea el código QR con la app **Expo Go** (Android/iOS).
   - O presiona `a` para abrir en emulador Android o `i` para simulador iOS.
