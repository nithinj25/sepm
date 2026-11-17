# Database design (OHAMS-10)

## Entities

| Entity | Purpose |
|---|---|
| User | Login account for every role (patient, doctor, admin) |
| Patient | Patient profile, one per patient user |
| Department | Hospital department, e.g. Cardiology |
| Doctor | Doctor profile, belongs to one department |
| DoctorAvailability | Weekly working hours of a doctor |
| ScheduleException | Days a doctor is on leave |
| Appointment | A booked slot between a patient and a doctor |
| Notification | Message sent to a user about an appointment |

## Relationships

- User 1–1 Patient, User 1–1 Doctor (admins have no profile)
- Department 1–N Doctor
- Doctor 1–N DoctorAvailability, Doctor 1–N ScheduleException
- Patient 1–N Appointment, Doctor 1–N Appointment
- Appointment 1–N Notification

## ER diagram

```mermaid
erDiagram
    USERS ||--o| PATIENTS : "is a"
    USERS ||--o| DOCTORS : "is a"
    DEPARTMENTS ||--o{ DOCTORS : has
    DOCTORS ||--o{ DOCTOR_AVAILABILITY : sets
    DOCTORS ||--o{ SCHEDULE_EXCEPTIONS : takes
    PATIENTS ||--o{ APPOINTMENTS : books
    DOCTORS ||--o{ APPOINTMENTS : attends
    APPOINTMENTS ||--o{ NOTIFICATIONS : triggers
    USERS ||--o{ NOTIFICATIONS : receives

    USERS {
        uuid id PK
        string name
        string email UK
        string phone
        string password_hash
        string role
    }
    PATIENTS {
        uuid id PK
        uuid user_id FK
        date date_of_birth
        string gender
    }
    DEPARTMENTS {
        int id PK
        string name UK
    }
    DOCTORS {
        uuid id PK
        uuid user_id FK
        int department_id FK
        string specialization
        int slot_duration_min
    }
    DOCTOR_AVAILABILITY {
        int id PK
        uuid doctor_id FK
        int day_of_week
        time start_time
        time end_time
    }
    SCHEDULE_EXCEPTIONS {
        int id PK
        uuid doctor_id FK
        date date
        string reason
    }
    APPOINTMENTS {
        uuid id PK
        uuid patient_id FK
        uuid doctor_id FK
        date appointment_date
        time start_time
        time end_time
        string status
    }
    NOTIFICATIONS {
        int id PK
        uuid user_id FK
        uuid appointment_id FK
        string type
        string status
    }
```
