-- OHAMS database schema (PostgreSQL)  -- OHAMS-10

CREATE TABLE users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name          VARCHAR(100) NOT NULL,
    email         VARCHAR(150) NOT NULL UNIQUE,
    phone         VARCHAR(15),
    password_hash TEXT NOT NULL,
    role          VARCHAR(10) NOT NULL CHECK (role IN ('patient', 'doctor', 'admin')),
    created_at    TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE patients (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id           UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE RESTRICT,
    date_of_birth     DATE,
    gender            VARCHAR(10),
    address           TEXT,
    emergency_contact VARCHAR(15)
);

CREATE TABLE departments (
    id   SERIAL PRIMARY KEY,
    name VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE doctors (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id           UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE RESTRICT,
    department_id     INT NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
    specialization    VARCHAR(100),
    qualification     VARCHAR(100),
    consultation_fee  NUMERIC(8,2),
    slot_duration_min INT NOT NULL DEFAULT 15 CHECK (slot_duration_min > 0)
);

CREATE TABLE doctor_availability (
    id          SERIAL PRIMARY KEY,
    doctor_id   UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time  TIME NOT NULL,
    end_time    TIME NOT NULL,
    is_active   BOOLEAN NOT NULL DEFAULT TRUE,
    CHECK (end_time > start_time)
);

CREATE TABLE schedule_exceptions (
    id        SERIAL PRIMARY KEY,
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    date      DATE NOT NULL,
    reason    TEXT
);

CREATE TABLE appointments (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id          UUID NOT NULL REFERENCES patients(id) ON DELETE RESTRICT,
    doctor_id           UUID NOT NULL REFERENCES doctors(id) ON DELETE RESTRICT,
    appointment_date    DATE NOT NULL,
    start_time          TIME NOT NULL,
    end_time            TIME NOT NULL,
    status              VARCHAR(10) NOT NULL DEFAULT 'booked'
                        CHECK (status IN ('booked', 'cancelled', 'completed', 'no_show')),
    reason              TEXT,
    cancelled_by        UUID REFERENCES users(id),
    cancellation_reason TEXT,
    created_at          TIMESTAMP NOT NULL DEFAULT now(),
    updated_at          TIMESTAMP NOT NULL DEFAULT now(),
    CHECK (end_time > start_time)
);

-- No double booking: a doctor's slot can hold only one active appointment
CREATE UNIQUE INDEX uq_active_slot
    ON appointments (doctor_id, appointment_date, start_time)
    WHERE status <> 'cancelled';

CREATE INDEX idx_appt_patient ON appointments (patient_id);
CREATE INDEX idx_appt_doctor_date ON appointments (doctor_id, appointment_date);

CREATE TABLE notifications (
    id             SERIAL PRIMARY KEY,
    user_id        UUID NOT NULL REFERENCES users(id),
    appointment_id UUID REFERENCES appointments(id),
    type           VARCHAR(15) NOT NULL CHECK (type IN ('confirmation', 'cancellation', 'reminder')),
    channel        VARCHAR(10) NOT NULL DEFAULT 'email' CHECK (channel IN ('email', 'in_app')),
    status         VARCHAR(10) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
    sent_at        TIMESTAMP
);
