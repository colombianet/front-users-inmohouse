# ⚙️ Guía de Despliegue – InmoHouse

Esta guía describe el proceso completo para desplegar la aplicación InmoHouse en producción utilizando plataformas gratuitas como **Vercel** (frontend) y **Railway** (backend + base de datos).

---

## 🖥️ Frontend – Angular en Vercel

### ✅ Prerrequisitos

- Cuenta gratuita en [vercel.com](https://vercel.com)
- Repositorio público o privado en GitHub con el proyecto Angular (`front-users-inmohouse`)
- Angular 17 configurado con componentes standalone

### 🚀 Pasos para el despliegue

1. Inicia sesión en Vercel
2. Haz clic en `+ Add New Project`
3. Conecta tu cuenta de GitHub y selecciona el repositorio
4. En configuraciones de proyecto:
   - **Framework Preset**: `Other`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/front-users-inmohouse`
5. Agrega variables de entorno si usas API externas (ej. `BASE_API_URL`)
6. Haz clic en `Deploy`

> Se generará una URL pública como:
> `https://front-users-inmohouse-jkni.vercel.app/`

---

## 🔙 Backend – Spring Boot en Railway

### ✅ Prerrequisitos

- Cuenta gratuita en [railway.app](https://railway.app)
- Repositorio backend en GitHub (`back-users`)
- Base de datos MySQL creada o conectada en Railway

### 🚀 Pasos para el despliegue

1. Inicia sesión en Railway
2. Crea un nuevo proyecto y elige `Deploy from GitHub`
3. Selecciona el repositorio `back-users`
4. En la sección `Variables` define:
   - `DB_URL`
   - `DB_USERNAME`
   - `DB_PASSWORD`
   - (opcional: `JWT_SECRET`, `ALLOWED_ORIGINS`, etc.)
5. Conecta o crea una base de datos MySQL desde Railway
6. Verifica que el backend escuche en el puerto `8080`
7. Railway asignará una URL pública como:
   - `https://back-users.up.railway.app`

➡️ Esta URL puede usarse como base de API en el frontend (`environment.ts`)

---

## 🔐 Consideraciones de Seguridad

- 🔒 Autenticación basada en JWT, almacenado localmente
- 🚧 Interceptor HTTP inyecta el token en cada solicitud protegida
- 🔐 `RoleGuard` restringe rutas del frontend según rol extraído del token
- 🔐 Backend verifica roles y permisos antes de ejecutar endpoints protegidos

---

## ✅ Verificación Final

- Accede a la URL de Vercel como administrador, agente o cliente
- Prueba conexión con la API desplegada en Railway
- Revisa los logs y métricas de Railway en tiempo real
- Verifica respuesta del backend ante rutas protegidas (403, 401, etc.)

---

## 🧩 Alternativas de despliegue

| Plataforma     | Uso         | Observación                      |
|----------------|-------------|----------------------------------|
| **Netlify**    | Frontend    | Compatible con Angular, similar a Vercel |
| **Render**     | Backend     | Soporta Spring Boot con base de datos integrada |
| **Fly.io**     | Backend     | Ideal para despliegue global con edge locations |

---

Desplegar **InmoHouse** en estas plataformas permite escalabilidad sin costo, acceso global con HTTPS, y mantenimiento centralizado vía CI/CD desde GitHub.

📎 Para más detalles técnicos, revisa la [📘 Documentación Técnica](./decisiones-arquitectura.md)
