-- Table: public.customers

-- DROP TABLE IF EXISTS public.customers;

CREATE TABLE IF NOT EXISTS public.customers
(
    full_name text COLLATE pg_catalog."default" NOT NULL,
    address text COLLATE pg_catalog."default",
    "SIN" integer NOT NULL,
    reg_date timestamp without time zone NOT NULL DEFAULT now(),
    password text COLLATE pg_catalog."default" NOT NULL,
    email text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "Customers_pkey" PRIMARY KEY ("SIN")
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.customers
    OWNER to postgres;