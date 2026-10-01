-- Creación del Keyspace (Base de Datos)
CREATE KEYSPACE IF NOT EXISTS optica 
WITH replication = {
    'class': 'SimpleStrategy', 
    'replication_factor': 1
};

-- Selección del Keyspace
USE optica;

-- Tabla para almacenar el agendamiento de turnos
CREATE TABLE IF NOT EXISTS appointments_by_date (
    appointment_id uuid,
    patient_name text,
    dni text,
    email text,
    phone text,
    service text,
    appointment_date date,
    appointment_time text,
    notes text,
    status text,
    PRIMARY KEY ((appointment_date), appointment_time, appointment_id)
) WITH CLUSTERING ORDER BY (appointment_time ASC);

-- Ejemplo de inserción de un registro mediante consulta CQL:
INSERT INTO optica.appointments_by_date (
    appointment_id, 
    patient_name, 
    dni, 
    email, 
    phone, 
    service, 
    appointment_date, 
    appointment_time, 
    notes, 
    status
) VALUES (
    a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11,
    'María González',
    '12345678',
    'maria@example.com',
    '+595 981 123456',
    'Examen de la Vista',
    '2026-10-15',
    '10:00 AM',
    'Primera consulta',
    'CONFIRMADO'
);

-- Consulta CQL para listar los turnos de una fecha determinada:
SELECT * FROM optica.appointments_by_date 
WHERE appointment_date = '2026-10-15';