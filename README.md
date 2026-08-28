# 💰 AmigoGasto — SplitWise Collab (Plataforma Colaborativa de Gastos)

> Proyecto desarrollado para la asignatura **Ingeniería y Calidad de Software — Grupo 5**.  
> Arquitectura moderna basada en **Monorepo (Yarn Workspaces)** con **NestJS**, **MySQL (Docker)** y **React + Vite**.

---

## 📋 Tabla de Contenidos
- [1. Visión General del Proyecto](#1-visión-general-del-proyecto)
- [2. Documentación Formal de Gestión (SPMP IEEE 1058)](#2-documentación-formal-de-gestión-spmp-ieee-1058)
- [3. Arquitectura y Tecnologías](#3-arquitectura-y-tecnologías)
- [4. Estructura del Monorepo](#4-estructura-del-monorepo)
- [5. Guía de Instalación y Ejecución Local](#5-guía-de-instalación-y-ejecución-local)
- [6. Guía de Despliegue en Producción (VPS / Cloud)](#6-guía-de-despliegue-en-producción-vps--cloud)
- [7. Endpoints y Documentación OpenAPI (Swagger)](#7-endpoints-y-documentación-openapi-swagger)
- [8. Algoritmo de Liquidación Óptima (Min Cash Flow)](#8-algoritmo-de-liquidación-óptima-min-cash-flow)

---

## 1. Visión General del Proyecto

**AmigoGasto** es una aplicación colaborativa orientada a transparentar, registrar y simplificar los gastos compartidos entre amigos durante viajes, departamentos compartidos, salidas grupales y eventos.

### ✨ Funcionalidades Principales Implementadas:
- **Gestión de Grupos:** Creación de grupos categorizados (✈️ *Viajes*, 🏠 *Casas Compartidas*, 🎉 *Eventos*, 📌 *Otros*) con soporte multimoneda (USD, EUR, ARS, etc.).
- **Registro de Gastos:** Registro de gastos por categoría (Comida, Transporte, Hospedaje, Servicios, Salidas), indicación de usuario pagador y fecha.
- **División de Gastos (Splits):** Cálculo y asignación automática equitativa o personalizada entre los miembros seleccionados con ajuste de centavos sin discrepancias matemáticas.
- **Balances y Liquidación Inteligente:** Visualización de balances netos individuales y sugerencias óptimas de transferencias calculadas mediante el **Algoritmo Min Cash Flow / Greedy Debt Simplification**, minimizando el número total de transacciones requeridas.
- **Selector de Perspectiva:** Selector en tiempo real para visualizar la interfaz desde el punto de vista de cualquier amigo del grupo.

---

## 2. Documentación Formal de Gestión (SPMP IEEE 1058)

El documento formal de gestión de proyecto está disponible en [`docs/SPMP_IEEE_1058.md`](./docs/SPMP_IEEE_1058.md) y cumple rigurosamente con las 8 secciones de la norma **IEEE 1058**:
1. **Introducción:** Visión, entregables, referencias normativas (IEEE 1058, IEEE 730, ISO/IEC 25010) y glosario.
2. **Organización del Proyecto:** Marco Scrum de 8 semanas, organigrama y matriz RACI para los 6 roles (PO, PM, UX/UI Designer, 2 Frontend Devs, Backend Dev, QA Tester).
3. **Procesos Gerenciales:** Objetivos, supuestos, matriz de riesgos 5x5 con planes de mitigación/contingencia, métricas y cronograma Gantt de 4 Sprints.
4. **Procesos Técnicos:** Arquitectura C4 Nivel 2, diagramas UML (Casos de Uso, Clases, Secuencia) y modelos de procesos de negocio BPMN (Creación de grupos, División de gastos, Liquidación).
5. **Planificación de los Recursos:** Estimación en Story Points (180 SP / 1,080 HH), hardware, software y licencias.
6. **Planificación de la Calidad (SQA):** Objetivos ISO 25010, pirámide de pruebas, plantilla de casos de prueba IEEE 829, criterios DoR y DoD.
7. **Planificación de la Comunicación:** Matriz de ceremonias Scrum, canales y protocolo de escalamiento de bloqueos.
8. **Planificación de los Cambios (SCM):** Estrategia de ramas GitFlow adaptado, flujo formal RFC (Request for Change), comité CCB y SemVer 2.0.0.

---

## 3. Arquitectura y Tecnologías

| Componente | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Monorepo** | Yarn Classic Workspaces (v1.22+) | Gestión centralizada de dependencias y scripts |
| **Backend API** | NestJS 10, TypeORM, TypeScript | API REST modular, pipes de validación y Swagger |
| **Base de Datos** | MySQL 8.0 Oficial en Docker | Persistencia relacional de usuarios, grupos, gastos y balances |
| **Frontend Web** | React 18 + Vite + TypeScript | SPA reactiva con componentes desacoplados |
| **Estilos & UI** | TailwindCSS + Lucide React | Tokens de diseño preparados para Figma UI Kit |
| **Infraestructura** | Docker Compose | Contenedores Linux aislados para MySQL y phpMyAdmin |

---

## 4. Estructura del Monorepo

```plaintext
Actividad-2/
├── apps/
│   ├── backend/                     # Backend en NestJS
│   │   ├── src/
│   │   │   ├── config/              # Configuración de BD y variables
│   │   │   ├── modules/
│   │   │   │   ├── users/           # Módulo de usuarios
│   │   │   │   ├── groups/          # Módulo de grupos y membresías
│   │   │   │   ├── expenses/        # Módulo de gastos y splits
│   │   │   │   ├── balances/        # Balances y algoritmo Min Cash Flow
│   │   │   │   └── seed/            # Carga de datos iniciales demo
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── frontend/                    # Frontend en React + Vite
│       ├── src/
│       │   ├── components/          # Componentes desacoplados (Navbar, Sidebar, Modales)
│       │   ├── context/             # Estado global AppContext
│       │   ├── services/            # Cliente API Axios y fallback
│       │   ├── types/               # Tipos TypeScript compartidos
│       │   ├── App.tsx
│       │   └── main.tsx
│       ├── package.json
│       ├── vite.config.ts
│       └── tailwind.config.js
│
├── docs/
│   └── SPMP_IEEE_1058.md            # Plan de Gestión formal IEEE 1058
├── docker-compose.yml               # Orquestación de MySQL 8.0 y phpMyAdmin
├── package.json                     # Configuración de Yarn Workspaces raíz
└── .env.example                     # Variables de entorno
```

---

## 5. Guía de Instalación y Ejecución Local

### Prerrequisitos:
- **Node.js:** v18+ o v20+ LTS
- **Yarn:** v1.22+
- **Docker & Docker Compose**

### Paso 1: Clonar y preparar variables de entorno
```bash
cp .env.example .env
```

### Paso 2: Instalar dependencias con Yarn
```bash
yarn install
```

### Paso 3: Levantar la Base de Datos MySQL en Docker
```bash
docker compose up -d
```
> Esto levantará MySQL 8.0 en el puerto `3306` y phpMyAdmin en el puerto `8080` (usuario `root`, contraseña `rootpassword`).

### Paso 4: Iniciar Backend y Frontend simultáneamente
```bash
yarn dev
```
O de forma independiente:
- **Backend:** `yarn start:backend` (Disponible en `http://localhost:3001/api`)
- **Frontend:** `yarn start:frontend` (Disponible en `http://localhost:5173`)

---

## 6. Guía de Despliegue en Producción (VPS / Cloud)

Para desplegar la aplicación completa en entornos de producción, consulta la [**Guía de Despliegue (`docs/DEPLOYMENT_GUIDE.md`)**](./docs/DEPLOYMENT_GUIDE.md), que incluye:
- **Opción A (VPS / Docker Compose):** Despliegue integral con `docker-compose.prod.yml`, Nginx y certificado SSL HTTPS automático vía Certbot.
- **Opción B (PaaS / Cloud):** Frontend en Vercel/Netlify, Backend en Render/Railway y MySQL administrado.

Comando rápido para levantar producción en VPS:
```bash
docker compose -f docker-compose.prod.yml up -d --build
```

---

## 7. Endpoints y Documentación OpenAPI (Swagger)

Una vez iniciado el backend, accede a la documentación interactiva Swagger en:  
👉 **`http://localhost:3001/api/docs`**

| Módulo | Método | Endpoint | Descripción |
| :--- | :---: | :--- | :--- |
| **Seed** | `POST` | `/api/seed` | Inicializa datos demo de usuarios, grupos y gastos |
| **Usuarios** | `GET` | `/api/users` | Lista todos los usuarios registrados |
| **Usuarios** | `POST` | `/api/users` | Registra un nuevo usuario |
| **Grupos** | `GET` | `/api/groups` | Lista grupos con información consolidada |
| **Grupos** | `POST` | `/api/groups` | Crea un grupo con categoría y miembros |
| **Grupos** | `GET` | `/api/groups/:id` | Obtiene detalle de grupo, gastos y participantes |
| **Grupos** | `POST` | `/api/groups/:id/members` | Añade un miembro a un grupo existente |
| **Gastos** | `GET` | `/api/groups/:id/expenses` | Lista gastos del grupo con sus divisiones |
| **Gastos** | `POST` | `/api/groups/:id/expenses` | Registra un gasto y calcula los splits |
| **Balances** | `GET` | `/api/groups/:id/balances` | Calcula balances netos y sugerencias Min Cash Flow |
| **Balances** | `POST` | `/api/groups/:id/settlements`| Registra un pago de liquidación directa |

---

## 8. Algoritmo de Liquidación Óptima (Min Cash Flow)

El motor financiero de la plataforma implementa un algoritmo codicioso (*Greedy*) de simplificación de redes de flujo de efectivo:
1. Calcula para cada usuario su balance neto $B_i = \text{Pagado}_i - \text{Consumido}_i + \text{Liquidaciones Pagadas}_i - \text{Liquidaciones Recibidas}_i$.
2. Agrupa a los participantes en acreedores ($B_i > 0$) y deudores ($B_i < 0$).
3. En cada paso toma al mayor deudor y al mayor acreedor, transfiriendo $\min(|B_{\text{deudor}}|, B_{\text{acreedor}})$.
4. El proceso se repite hasta que todos los saldos quedan saldados ($B_i = 0$), reduciendo una red compleja de deudas cruzadas al número mínimo posible de pagos.
