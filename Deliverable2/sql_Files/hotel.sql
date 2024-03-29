-- Table: public.hotel

-- DROP TABLE IF EXISTS public.hotel;

CREATE TABLE IF NOT EXISTS public.hotel
(
    "hotelID" integer NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    address text COLLATE pg_catalog."default" NOT NULL,
    num_of_rooms integer NOT NULL,
    email text COLLATE pg_catalog."default" NOT NULL,
    rating integer NOT NULL,
    "chainID" integer NOT NULL,
    phonenum text COLLATE pg_catalog."default",
    CONSTRAINT "Hotel_pkey" PRIMARY KEY ("hotelID")
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.hotel
    OWNER to postgres;
