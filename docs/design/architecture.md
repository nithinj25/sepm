# System architecture (OHAMS-11)

## Style

Three-tier client–server web application talking over a REST API.

| Layer | Technology | Responsibility |
|---|---|---|
| Presentation | React single-page app (static demo in `frontend/`) | Patient portal, doctor dashboard, admin dashboard |
| Application | Node.js + Express REST API (Vercel serverless functions) | Business rules, validation, authentication |
| Data | PostgreSQL (managed) | Persistent storage – see [database.md](database.md) |
| External | Email service (Nodemailer / SendGrid) | Confirmation, cancellation and reminder emails |

**Why this style:** three clear layers let the team split work (frontend / backend / database), every layer can be hosted on free tiers, and a relational database fits appointment data, which needs strict rules such as no double booking.

## Component diagram

```mermaid
flowchart LR
    subgraph Client["Browser"]
        PP[Patient portal]
        DD[Doctor dashboard]
        AD[Admin dashboard]
    end
    subgraph API["REST API (Express)"]
        AUTH[Auth]
        APPT[Appointments]
        SCHED[Schedule]
        ADMIN[Admin]
        NOTIF[Notifications]
    end
    DB[(PostgreSQL)]
    MAIL[[Email service]]

    PP --> AUTH & APPT
    DD --> AUTH & APPT & SCHED
    AD --> AUTH & ADMIN & APPT
    APPT --> SCHED
    APPT --> NOTIF
    AUTH & APPT & SCHED & ADMIN & NOTIF --> DB
    NOTIF --> MAIL
```

## REST API

| Method | Endpoint | Allowed role |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/departments` | Any logged-in user |
| GET | `/api/doctors?department=` | Patient |
| GET | `/api/doctors/:id/slots?date=` | Patient |
| POST | `/api/appointments` | Patient |
| GET | `/api/appointments/me` | Patient |
| PATCH | `/api/appointments/:id/cancel` | Patient, Doctor, Admin |
| PATCH | `/api/appointments/:id/reschedule` | Patient |
| GET | `/api/doctors/me/appointments?from=&to=` | Doctor |
| PATCH | `/api/appointments/:id/status` | Doctor |
| GET / PUT | `/api/doctors/me/availability` | Doctor |
| GET | `/api/admin/appointments` | Admin |
| GET | `/api/admin/stats` | Admin |
| POST / PUT | `/api/admin/doctors` | Admin |
| POST / PUT | `/api/admin/departments` | Admin |

Errors use standard status codes: `400` invalid input, `401` not logged in, `403` wrong role, `404` not found, `409` slot already taken.

## Security and privacy

- Passwords hashed with bcrypt; login returns a JWT with an expiry
- Role-based access control: every endpoint checks the user's role (table above)
- Patients see only their own appointments; doctors see only their own schedule
- HTTPS only; secrets (database URL, JWT secret, email password) kept in environment variables, never in the repo
- Every request body validated; parameterised SQL only (no string-built queries) to prevent SQL injection

### Ethical considerations

- Appointment reasons and dates are health-related personal data: collect only what is needed, ask for consent at registration, and follow the principles of India's Digital Personal Data Protection Act, 2023
- Admins can see appointment lists but not more patient detail than they need
- Notifications never put the visit reason in the email subject line
- The system must stay usable for older patients: simple language and large buttons

## Deployment diagram

```mermaid
flowchart LR
    U[User's browser] -- HTTPS --> V
    subgraph V["Vercel"]
        S[Static frontend]
        F[Serverless API functions]
    end
    S --> F
    F -- SSL --> DB[(Managed PostgreSQL)]
    F -- SMTP/API --> M[[Email provider]]
    GH[GitHub repo] -- push to main --> V
```

Details: [../deployment.md](../deployment.md)
