-- Table: public.hotel chain

-- DROP TABLE IF EXISTS public."hotel chain";

CREATE TABLE IF NOT EXISTS public."hotel chain"
(
    "chainID" integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    address text COLLATE pg_catalog."default",
    email text COLLATE pg_catalog."default",
    chainname text COLLATE pg_catalog."default" NOT NULL,
    phonenum text COLLATE pg_catalog."default",
    CONSTRAINT "Hotel Chain_pkey" PRIMARY KEY ("chainID")
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."hotel chain"
    OWNER to postgres;
