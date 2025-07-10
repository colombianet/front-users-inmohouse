# 🏡 InmoHouse - Sistema de Gestión Inmobiliaria

**InmoHouse** es una aplicación web moderna que digitaliza la gestión de propiedades, agentes y clientes para una empresa inmobiliaria. Desarrollada con una arquitectura limpia y escalable, ofrece seguridad, control por roles y una experiencia de usuario optimizada.

## 🚀 Tecnologías Utilizadas

- Angular 17.3.0 (Standalone Components + Angular Material)
- SCSS + Metodología BEM
- Spring Boot (Java 17)
- MySQL en Railway
- JWT para autenticación y autorización
- Vercel para frontend | Railway para backend y base de datos
- ngx-charts para gráficas dinámicas
- Exportación de datos a Excel y PDF

## 📦 Arquitectura del Proyecto

La estructura sigue los principios de Clean Architecture adaptados, basada en capas desacopladas:


## 🔐 Seguridad y Roles

- Redirección automática post-login según rol
- `RoleGuard` protege rutas privadas
- Token JWT decodificado localmente
- Acciones como editar/eliminar condicionadas al rol
- Pantallas de error 403 y 404 personalizadas

## 📊 Funcionalidades Destacadas

- Dashboards únicos para admin, agente y cliente
- CRUD completo para propiedades (admin)
- CRUD completo para usuarios (admin)
- CRUD de clientes por agentes
- Lectura de propiedades para clientes
- Estadísticas: propiedades por agente
- Exportaciones: Excel y PDF
- Diseño responsivo optimizado para desktop y móvil

## 🧪 Credenciales de Prueba

- **Administrador:** oscar@mail.com / 12345  
- **Agente:** agente@mail.com / 12345  
- **Cliente:** cliente@mail.com / 12345  

## ⚙️ Instalación y Ejecución

### Backend (Spring Boot - Railway)

```bash
git clone https://github.com/colombianet/back-users
cd back-users
# Configurar variables en application.properties
./mvnw spring-boot:run

### 🖥️ Frontend (Angular - Vercel)

```bash
# Clonar el repositorio
git clone https://github.com/colombianet/front-users-inmohouse
cd front-users-inmohouse

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start  # alias para ng serve

📦 Versión de Angular utilizada: **17.3.0**

🔒 Autenticación: **JWT gestionado a través de AuthService**  
Se valida el token y se decodifica localmente para controlar acceso según el rol.

🚧 Rutas protegidas: **RoleGuard implementado**  
Protege rutas específicas del dashboard basándose en el rol extraído del token JWT.

🎨 Interfaz de usuario: **Angular Material + SCSS con metodología BEM**  
Diseño consistente, reutilizable y visualmente limpio, siguiendo buenas prácticas de CSS estructurado.

📱 Diseño responsivo: **media queries + Flexbox**  
La experiencia se adapta fluidamente a desktop, tablet y móvil.

🔗 Aplicación en producción:  
[Vercel - Frontend](https://front-users-inmohouse.vercel.app/)

## 📄 Documentación Técnica

- ✅ **Arquitectura basada en Clean Architecture**, separada en capas:
  - `@domain`: modelos, interfaces, contratos y gateways.
  - `@application`: casos de uso desacoplados por responsabilidad (`listar-clientes.usecase.ts`, `crear-propiedad.usecase.ts`, etc.).
  - `@infrastructure`: adaptadores HTTP para backend y almacenamiento local (`AuthStorageAdapter`, `UsuarioHttpService`, etc.).
  - `@components`: componentes standalone organizados por rol (admin, agente, cliente).

- 🧱 **Diseño modular con Angular Standalone Components**:
  - Cada dashboard está encapsulado: `AdminDashboardComponent`, `AgenteDashboardComponent`, `ClienteDashboardComponent`.
  - Servicios y casos de uso se inyectan como providers locales para mantener desacoplamiento.

- 🎨 **Estilos SCSS con metodología BEM**:
  - Archivos segmentados (`_dashboard.scss`, `_buttons.scss`, `_dashboard-table.scss`).
  - Personalización visual por tipo de usuario: `.dashboard--admin`, `.dashboard--agente`, `.dashboard--cliente`.

- 📊 **Pipes personalizados para visualización de datos**:
  - `precioMoneda`: convierte valores numéricos en moneda formateada.
  - `estado`: traduce y estiliza el estado de una propiedad (`DISPONIBLE`, `VENDIDA`, etc.).

- 🔐 **Sistema de autenticación y autorización con JWT**:
  - Token gestionado mediante `AuthService`.
  - Decodificación local del token para determinar rol.
  - `RoleGuard` protege rutas específicas por rol (`admin`, `agente`, `cliente`).

- 📦 **Exportaciones**:
  - Datos exportables a Excel y PDF desde los dashboards.
  - Integración con FileSaver.js y formatos dinámicos.

- 📈 **Visualización de estadísticas**:
  - Uso de `ngx-charts` para representar propiedades por agente, tipo o estado.
  - Navegación directa desde el dashboard de administrador hacia módulo de estadísticas.

- ⚙️ **Interacción de formularios**:
  - Formularios reactivos con validación en `UserFormComponent` y `PropertyFormComponent`.
  - Modales reutilizables (`MatDialog`) para editar, crear y eliminar.

- 🧪 **Control de errores y usabilidad**:
  - Snackbars informativos (`MatSnackBar`) para todas las acciones.
  - Plantillas condicionales con `ng-template` para mostrar estados personalizados.
  - Paginación, botones de acción y manejo de vacíos en `DashboardTableComponent`.


