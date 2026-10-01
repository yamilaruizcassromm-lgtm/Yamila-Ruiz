-- 1. Crear tipo enumerado para el estado del turno (opcional pero recomendado)
CREATE TYPE appointment_status AS ENUM (
    'PENDIENTE',
    'CONFIRMADO',
    'CANCELADO',
    'COMPLETADO'
);

-- 2. Crear la tabla de agendamientos (Appointments)
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_name TEXT NOT NULL,
    patient_dni TEXT NOT NULL,
    patient_email TEXT,
    patient_phone TEXT,
    service_type TEXT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    notes TEXT,
    status appointment_status NOT NULL DEFAULT 'PENDIENTE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Crear índices para optimizar las consultas frecuentes
-- Búsqueda de turnos por fecha (ordenados por hora)
CREATE INDEX IF NOT EXISTS idx_appointments_date_time 
ON public.appointments (appointment_date, appointment_time);

-- Búsqueda rápida por DNI del paciente
CREATE INDEX IF NOT EXISTS idx_appointments_dni 
ON public.appointments (patient_dni);

-- 4. Habilitar Row Level Security (RLS) para proteger los datos
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Política de ejemplo: Permitir lectura y escritura pública (Ajustar según requerimientos de Auth)
CREATE POLICY "Permitir acceso total a usuarios autenticados" 
ON public.appointments 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);


-- 5. Inserción de prueba
INSERT INTO public.appointments (
    patient_name, 
    patient_dni, 
    patient_email, 
    patient_phone, 
    service_type, 
    appointment_date, 
    appointment_time, 
    notes, 
    status
) VALUES (
    'María González',
    '12345678',
    'maria@example.com',
    '+595 981 123456',
    'Examen de la Vista',
    '2026-10-15',
    '10:00:00',
    'Primera consulta',
    'CONFIRMADO'
);

-- 6. Consulta para obtener los turnos de una fecha determinada (Ordenados por hora)
SELECT * 
FROM public.appointments 
WHERE appointment_date = '2026-10-15'
ORDER BY appointment_time ASC;