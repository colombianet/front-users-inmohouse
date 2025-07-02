# 🏡 InmoHouse Frontend

Aplicación desarrollada con Angular 17. Gestiona el acceso por roles, autentica usuarios con JWT, y conecta con un backend construido en Spring Boot. Sigue principios de Clean Architecture adaptados e implementa buenas prácticas visuales y estructurales.

---

## 🚀 Tecnologías utilizadas

- Angular 17 (Standalone Components)
- Angular Material
- SCSS con metodología BEM
- Autenticación con JWT
- Spring Boot + MySQL (backend)
- Responsive Design con media queries
- Clean Architecture inspirada en Bancolombia

---

## 🔐 Autenticación

- Formulario con `ReactiveForms` y validación visual
- Token JWT almacenado en `localStorage` mediante `AuthService`
- Redirección automática post-login basada en rol (`DashboardComponent`)
- Logout funcional con retroalimentación (`MatSnackBar`)
- Roles soportados: `ROLE_ADMIN`, `ROLE_AGENTE`, `ROLE_CLIENTE`

---

## 🛡️ Seguridad y navegación

- `RoleGuard` protege rutas por rol usando el token decodificado
- Vistas de error dedicadas:
  - **403 - Acceso no autorizado**
  - **404 - Página no encontrada**
- Redirecciones automáticas desde `dashboard` hacia el dashboard por rol
- `AuthService` expone nombre del usuario y rol desde el token

---

## 📁 Estructura del proyecto


---

## 📸 Funcionalidades destacadas

- Diseño responsivo con Flexbox y Angular Material
- Spinner de carga durante login
- Feedback visual en errores de credenciales
- Constantes desacopladas para textos y rutas
- Login centralizado vía `LoginUserUseCase`

---

## 🧪 Credenciales de prueba

> Estas pueden ajustarse según el backend configurado

- **Admin:** `admin@mail.com` / `12345`
- **Agente:** `agente@mail.com` / `12345`
- **Cliente:** `cliente@mail.com` / `12345`

---

## ⚙️ Comandos Angular CLI

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm start   # alias de ng serve

# Build de producción
ng build

# Generar componentes
ng generate component nombre-componente

# Test unitarios
ng test

### Deploy y backend
Este frontend está preparado para integrarse con un backend en Spring Boot (puerto típico: localhost:8080)

Las rutas protegidas esperan tokens válidos con payload roles: [ROL] y nombre

