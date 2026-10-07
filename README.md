# EduPlatform – Education Management Platform

A full-stack web platform for an education center that brings **administrators, teachers and students** together: course and subject management, teacher assignments, **online classes with automatic Zoom meeting creation**, student profiles and **statistics dashboards**.

## ✨ Features

- **Role-based access** for administrators, teachers and students, with JWT authentication
- **Courses & subjects**: create and manage courses, subjects and school levels (7th grade → Baccalaureate)
- **Teacher assignments**: assign teachers to subjects and levels
- **Online classes**: Zoom meetings are created automatically through the Zoom Server-to-Server OAuth API
- **Statistics**: dashboards with charts for the administration
- **Public pages** for visitors, plus a WhatsApp contact link

## 🏗️ Architecture

```
React (Vite, MUI) ──REST / JSON──▶ Spring Boot API (JWT) ──▶ PostgreSQL
                                          │
                                          └──▶ Zoom API (online classes)
```

**Back end** – layered Spring Boot application: `entity → repository → service (impl) → controller`, with request/response DTOs.

| Resource | Endpoint |
|---|---|
| Authentication | `/api/auth` |
| Students | `/api/eleves` |
| Teachers | `/api/enseignants` |
| Subjects | `/api/matieres` |
| Courses | `/api/cours` |
| Online classes | `/api/cours-en-ligne` |
| Assignments | `/api/affectations` |
| Statistics | `/api/statistiques` |
| Profile / public | `/api/profile`, `/api/public` |

## 🛠️ Tech stack

| Area | Technologies |
|---|---|
| Back end | Java 17, Spring Boot 3, Spring Security + JWT (JJWT), Spring Data JPA, Springdoc OpenAPI, Lombok |
| Database | PostgreSQL |
| Front end | React 18, Vite, React Router, Material UI, Axios |
| Forms & charts | React Hook Form + Yup, Recharts |
| Integration | Zoom API (Server-to-Server OAuth) |

## 🚀 Getting started

Requirements: Java 17, Node.js 18+, PostgreSQL, Maven.

```bash
# 1. Back end
cd backend
# set your PostgreSQL credentials in src/main/resources/application.properties
# (optional) set ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET for online classes
mvn clean spring-boot:run

# 2. Front end
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open `http://localhost:5173`. The API documentation is available through Springdoc OpenAPI (Swagger UI) when the back end is running.

📘 Full technical documentation (setup, Zoom configuration, troubleshooting) in French: [DOCUMENTATION.md](DOCUMENTATION.md)

> The default credentials in `application.properties` are for local development only — use environment variables in production.
