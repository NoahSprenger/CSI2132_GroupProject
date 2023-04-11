-- Table: public.employees

-- DROP TABLE IF EXISTS public.employees;

CREATE TABLE IF NOT EXISTS public.employees
(
    "SIN" integer NOT NULL,
    role text COLLATE pg_catalog."default" NOT NULL,
    full_name text COLLATE pg_catalog."default" NOT NULL,
    address text COLLATE pg_catalog."default",
    email text COLLATE pg_catalog."default" NOT NULL,
    password text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "Employees_pkey" PRIMARY KEY ("SIN"),
    CONSTRAINT role CHECK (role = ANY (ARRAY['manager'::character varying::text, 'staff'::character varying::text, 'cleaner'::character varying::text])) NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.employees
    OWNER to postgres;