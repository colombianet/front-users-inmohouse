# 🎓 Presentación Técnica – InmoHouse

---

## 🏗️ Decisiones de Arquitectura

- **Clean Architecture adaptada**  
  Separación clara de responsabilidades en capas (`@domain`, `@application`, `@infrastructure`, `@presentation`) permite escalabilidad, testabilidad y mantenimiento efectivo.

- **Componentes Standalone en Angular 17**  
  Arquitectura sin módulos que reduce acoplamiento, acelera la carga y facilita la organización por contexto (`admin`, `agente`, `cliente`).

- **Casos de uso desacoplados**  
  Cada operación (`listar`, `crear`, `editar`, `eliminar`) está encapsulada en su propio caso de uso, respetando el principio de inversión de dependencias.

- **Providers modularizados por rol**  
  Dependencias se agrupan en archivos como `admin-dashboard.providers.ts`, reduciendo el decorador del componente y mejorando organización.

- **Inyección simplificada con `inject()`**  
  Reemplazo del constructor tradicional por `inject()`, permitiendo inyección directa y más legible de dependencias.

- **Imports centralizados con barrel files e index.ts**  
  Reorganización de importaciones desde rutas largas hacia archivos `index.ts` por dominio (`@application/use-cases`, `@infrastructure/adapters`, etc.).

- **SCSS con metodología BEM**  
  Estructura clara de clases (`.dashboard__tabla`, `.dashboard__card`) y estilos segmentados (`_dashboard.scss`, `_buttons.scss`, `_estadisticas.scss`) con responsividad integrada.

---

## 🔐 Seguridad y Roles

- **Autenticación con JWT**  
  Token gestionado mediante `AuthService` y decodificado localmente. El rol determina navegación, permisos y restricciones visuales.

- **Protección de rutas por rol (`RoleGuard`)**  
  Acceso condicional basado en rol decodificado (`admin`, `agente`, `cliente`) con redirección automática post-login.

- **Interceptores para errores y expiración de sesión**  
  Manejo centralizado de respuestas HTTP, mensajes y validación del token (auto-logout, redirección 403/404).

- **Control visual por permisos**  
  Botones de edición/eliminación y modales ocultos según permisos del usuario, evitando intentos no autorizados.

---

## 🎨 Interfaz y Usabilidad

- **Angular Material + `MaterialModule` compartido**  
  Todos los componentes Angular Material son importados en un solo módulo para simplificar imports y mejorar consistencia visual.

- **Componentes standalone por contexto**  
  Cada dashboard (`AdminDashboardComponent`, `AgenteDashboardComponent`, `ClienteDashboardComponent`) usa componentes autónomos encapsulados.

- **Formularios reactivos y validaciones por rol**  
  `UserFormComponent` y `PropertyFormComponent` con `FormGroup`, validaciones, e interacción con `MatDialog`.

- **Mensajes y feedback visual**  
  `MatSnackBar` para confirmaciones, `MatTooltip` para íconos de ayuda, paginación, scroll responsivo y estados vacíos gestionados con `ng-template`.

---

## 📊 Visualización y Exportación

- **Gráficas con ngx-charts**  
  Estadísticas por agente y por tipo, con `ngx-charts-bar-horizontal` y `ngx-charts-bar-vertical`. Desactivación de animaciones para estabilidad en móvil.

- **Etiquetas de porcentaje sobre las barras**  
  Ejemplo: `12 • 23.1%` indicando cantidad absoluta y proporción sobre el total. Calculado dinámicamente con `formatearPorcentaje()`.

- **Resumen superior con participación por tipo**  
  Tarjeta con tipo más dominante en la vista (`Mayor participación: CASA (42.3%)`), calculado y mostrado en el resumen del dashboard.

- **Exportación de datos a Excel y PDF**  
  Componente `ExportButtonComponent` con integración a FileSaver.js y generación de archivos dinámicos para agentes, tipos o estado.

---

## 🚀 Despliegue

- **Frontend en Vercel**  
  Interfaz en Angular alojada en [https://front-users-inmohouse-jkni.vercel.app/](https://front-users-inmohouse.vercel.app)

- **Backend en Railway**  
  API REST con Spring Boot y conexión a MySQL gestionada en Railway. Comunicación segura vía JWT.

---

## 🧪 Mejoras futuras

- 🔐 Login con Azure Active Directory (bonus del enunciado)
- 🧪 Tests unitarios con Jest (frontend) y SpringTest (backend)
- ✅ Validaciones adicionales según contexto y rol
- 💰 Dashboard financiero para análisis de rentabilidad y propiedades
- 🌐 Internacionalización (i18n) para soporte multilenguaje
- 📈 Exportación como imagen para compartir estadísticas
