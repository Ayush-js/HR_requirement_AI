# HR Sanctuary -- AI-Powered Human Resources Platform

HR Sanctuary is a full-stack, AI-powered HR management platform that automates and streamlines core HR workflows including resume screening, policy Q&A, performance appraisals, and offer letter generation. It combines a Spring Boot backend with a React frontend and uses large language models (Groq/LLaMA) alongside a vector database for intelligent document understanding.

---

## Table of Contents

- [Features](#features)
- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
  - [Authentication](#authentication)
  - [Job Descriptions](#job-descriptions)
  - [Resume Screening](#resume-screening)
  - [Policy Q&A](#policy-qa)
  - [Appraisals](#appraisals)
  - [Offer Letters](#offer-letters)
- [Project Structure](#project-structure)
- [License](#license)

---

## Features

### Smart Resume Screening
- Upload resumes in PDF or DOCX format against specific job descriptions.
- Automatic text extraction using Apache PDFBox and Apache POI.
- AI-driven candidate detail extraction (name, email, phone, skills, experience).
- Relevance scoring (0-100) of each resume against the job description.
- Ranked candidate listings for each job position.
- Resume embeddings stored in Qdrant vector database for semantic search.

### Policy Q&A (RAG)
- Upload internal HR policy documents (PDF/DOCX).
- Documents are chunked, embedded, and stored in Qdrant for retrieval-augmented generation.
- Ask natural language questions about company policies.
- The system retrieves relevant policy chunks via semantic similarity search and generates answers using LLM with source attribution.

### Performance Appraisals
- Input raw performance notes for any employee.
- AI generates structured appraisal summaries with strengths, areas for improvement, and suggested ratings.
- Appraisals support a draft-to-finalized workflow with edit capability before finalization.
- Historical appraisal retrieval by employee.

### Offer Letter Generation
- Generate professional offer letters by providing candidate, role, salary, joining date, and company details.
- AI produces complete, ready-to-send offer letters.
- Draft and finalize workflow with editing support.
- Full offer letter history tracking.

### Authentication and Security
- User registration and login with JWT-based authentication.
- Spring Security integration with role-based access control.
- Protected API endpoints with automatic token validation.
- Frontend route protection with automatic redirect to login.

### HR Hub Dashboard
- Central dashboard with quick access to all modules.
- Recent activity feed showing latest HR actions.
- Manager's corner with review progress tracking.

---

## Architecture Overview

```
+-------------------+         +---------------------+         +------------------+
|                   |  HTTP   |                     |         |                  |
|  React Frontend   +-------->+  Spring Boot API    +-------->+  MySQL Database  |
|  (Vite + TW v4)   |         |  (REST Controllers) |         |  (JPA/Hibernate) |
|                   |         |                     |         |                  |
+-------------------+         +----------+----------+         +------------------+
                                         |
                              +----------+----------+
                              |                     |
                    +---------v--------+  +---------v--------+
                    |                  |  |                   |
                    |  Groq API        |  |  Qdrant Vector   |
                    |  (LLaMA 3.3 70B)|  |  Store (gRPC)    |
                    |                  |  |                   |
                    +------------------+  +-------------------+
```

- **Frontend** communicates with the backend over REST (port 5173 -> port 8080).
- **Backend** orchestrates all business logic, document parsing, LLM interactions, and vector store operations.
- **Groq API** is used via OpenAI-compatible endpoints through Spring AI for all LLM tasks.
- **Qdrant** stores document embeddings for semantic search (policy Q&A and resume matching).
- **MySQL** persists all structured data (users, candidates, resumes, appraisals, offers, policies).

---

## Tech Stack

### Backend
| Component         | Technology                              |
|-------------------|-----------------------------------------|
| Framework         | Spring Boot 3.5                         |
| Language          | Java 17                                 |
| Database          | MySQL with Spring Data JPA / Hibernate  |
| Security          | Spring Security + JWT (jjwt 0.11.5)     |
| AI / LLM          | Spring AI with Groq (OpenAI-compatible) |
| LLM Model         | LLaMA 3.3 70B Versatile                 |
| Vector Store      | Qdrant (via Spring AI + gRPC)           |
| Embeddings        | ONNX Transformers (local)               |
| Document Parsing  | Apache PDFBox 3.0, Apache POI 5.3       |
| Build Tool        | Maven                                   |
| Code Generation   | Lombok                                  |

### Frontend
| Component    | Technology                   |
|--------------|------------------------------|
| Framework    | React 19                     |
| Build Tool   | Vite 8                       |
| Styling      | Tailwind CSS 4               |
| HTTP Client  | Axios                        |
| Routing      | React Router DOM 7           |
| Typography   | Inter, Instrument Serif      |
| Icons        | Material Symbols Outlined    |

---

## Prerequisites

- **Java 17** or later
- **Maven 3.8+** (or use the included Maven wrapper `mvnw`)
- **Node.js 18+** and **npm**
- **MySQL 8.0+**
- **Qdrant** vector database (optional, can be disabled)
- **Groq API key** -- obtain one at https://console.groq.com/keys

---

## Getting Started

### Backend Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Ayush-js/HR_requirement_AI.git
   cd HR_requirement_AI
   ```

2. **Create the MySQL database:**
   ```sql
   CREATE DATABASE hr_genai_db;
   ```

3. **Configure environment variables:**

   Copy the example environment file and fill in your values:
   ```bash
   cd hr-genai-backend
   cp .env.example .env
   ```

   Edit `.env` with your credentials:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   DB_USERNAME=root
   DB_PASSWORD=root
   JWT_SECRET=your_strong_jwt_secret_here
   ```

4. **Run the backend:**
   ```bash
   ./mvnw spring-boot:run
   ```
   On Windows:
   ```bash
   mvnw.cmd spring-boot:run
   ```

   The API server will start at `http://localhost:8080`.

### Frontend Setup

1. **Install dependencies:**
   ```bash
   cd hr-sanctuary
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

   The frontend will start at `http://localhost:5173`.

---

## Environment Variables

| Variable       | Required | Default                                                     | Description                                |
|----------------|----------|-------------------------------------------------------------|--------------------------------------------|
| `GROQ_API_KEY` | Yes      | --                                                          | API key for Groq AI service                |
| `DB_USERNAME`  | No       | `root`                                                      | MySQL database username                    |
| `DB_PASSWORD`  | No       | `root`                                                      | MySQL database password                    |
| `JWT_SECRET`   | No       | `hr_genai_super_secret_key_2024_make_this_long_enough...`   | Secret key for JWT token signing (HS256)   |

The MySQL database URL defaults to `jdbc:mysql://localhost:3306/hr_genai_db`. Qdrant defaults to `localhost:6334` with collection name `hr_genai_vectors`.

---

## API Reference

All endpoints are prefixed with `/api`. Protected endpoints require a `Bearer` token in the `Authorization` header.

### Authentication

| Method | Endpoint           | Description              | Auth Required |
|--------|--------------------|--------------------------|---------------|
| POST   | `/api/auth/login`    | Log in with email/password | No          |
| POST   | `/api/auth/register` | Register a new user        | No          |

### Job Descriptions

| Method | Endpoint      | Description                     | Auth Required |
|--------|---------------|---------------------------------|---------------|
| GET    | `/api/jobs`     | List all job descriptions       | Yes           |
| POST   | `/api/jobs`     | Create a new job description    | Yes           |

### Resume Screening

| Method | Endpoint                              | Description                                   | Auth Required |
|--------|---------------------------------------|-----------------------------------------------|---------------|
| POST   | `/api/resumes/upload`                   | Upload resumes (multipart) against a job ID   | Yes           |
| GET    | `/api/resumes/ranked/{jobDescriptionId}`| Get ranked candidates for a job               | Yes           |
| GET    | `/api/resumes/{resumeId}/profile`       | Get detailed resume profile                   | Yes           |
| DELETE | `/api/resumes/{resumeId}`               | Delete a resume                               | Yes           |

### Policy Q&A

| Method | Endpoint              | Description                            | Auth Required |
|--------|-----------------------|----------------------------------------|---------------|
| POST   | `/api/policies/upload`  | Upload a policy document (PDF/DOCX)    | Yes           |
| POST   | `/api/policies/ask`     | Ask a question about uploaded policies | Yes           |
| GET    | `/api/policies`         | List all active policy documents       | Yes           |
| DELETE | `/api/policies/{id}`    | Soft-delete a policy document          | Yes           |

### Appraisals

| Method | Endpoint                            | Description                              | Auth Required |
|--------|-------------------------------------|------------------------------------------|---------------|
| POST   | `/api/appraisals/generate`            | Generate an appraisal from raw notes     | Yes           |
| POST   | `/api/appraisals/{id}/finalize`       | Finalize a generated appraisal           | Yes           |
| GET    | `/api/appraisals/employee/{employeeId}`| Get appraisals for an employee          | Yes           |

### Offer Letters

| Method | Endpoint                  | Description                          | Auth Required |
|--------|---------------------------|--------------------------------------|---------------|
| POST   | `/api/offers/generate`      | Generate an offer letter             | Yes           |
| POST   | `/api/offers/{id}/finalize` | Finalize an offer letter             | Yes           |
| GET    | `/api/offers`               | List all offer letters               | Yes           |

---

## Project Structure

```
HR_requirement_AI/
|
|-- hr-genai-backend/                  # Spring Boot backend
|   |-- src/main/java/com/hrgenai/hr_genai_backend/
|   |   |-- config/                    # Security, JWT, CORS, Vector Store, LLM configs
|   |   |-- controller/               # REST API controllers
|   |   |-- dto/                       # Request and response DTOs
|   |   |-- exception/                 # Custom exception handlers
|   |   |-- model/                     # JPA entity models
|   |   |-- repository/               # Spring Data JPA repositories
|   |   |-- service/                   # Service interfaces
|   |   |   |-- impl/                  # Service implementations
|   |   |-- util/                      # Utility classes
|   |-- src/main/resources/
|   |   |-- application.properties     # Application configuration
|   |-- .env.example                   # Environment variable template
|   |-- pom.xml                        # Maven build configuration
|
|-- hr-sanctuary/                      # React frontend
|   |-- src/
|   |   |-- api/                       # Axios API client configuration
|   |   |-- components/                # Reusable UI components
|   |   |   |-- ui/                    # Base UI primitives
|   |   |-- context/                   # React context providers (Auth)
|   |   |-- pages/                     # Page-level components
|   |   |   |-- HRHub.jsx             # Dashboard / landing page
|   |   |   |-- SmartScreening.jsx    # Resume screening module
|   |   |   |-- PolicyQA.jsx          # Policy Q&A module
|   |   |   |-- AppraisalGenerator.jsx # Appraisal generation module
|   |   |   |-- OfferCenter.jsx       # Offer letter module
|   |   |   |-- Login.jsx             # Authentication page
|   |   |-- App.jsx                    # Root component with routing
|   |   |-- main.jsx                   # Application entry point
|   |   |-- index.css                  # Global styles
|   |-- index.html                     # HTML entry point
|   |-- vite.config.js                 # Vite build configuration
|   |-- package.json                   # npm dependencies
```

---

## License

This project is provided as-is for educational and development purposes.
