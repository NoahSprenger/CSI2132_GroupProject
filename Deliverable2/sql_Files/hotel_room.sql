-- Table: public.hotel_room

-- DROP TABLE IF EXISTS public.hotel_room;

CREATE TABLE IF NOT EXISTS public.hotel_room
(
    price integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    views text COLLATE pg_catalog."default" NOT NULL,
    extendable boolean NOT NULL,
    damages text COLLATE pg_catalog."default",
    "room_ID" integer NOT NULL,
    "hotel_ID" integer NOT NULL,
    capacity integer NOT NULL,
    amenities text[] COLLATE pg_catalog."default",
    status boolean NOT NULL DEFAULT true,
    CONSTRAINT "Hotel_Room_pkey" PRIMARY KEY ("room_ID"),
    CONSTRAINT price UNIQUE (price),
    CONSTRAINT room_id UNIQUE ("room_ID"),
    CONSTRAINT "hotel_ID" FOREIGN KEY ("hotel_ID")
        REFERENCES public.hotel ("hotelID") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT views CHECK (views = ANY (ARRAY['Mountain'::character varying::text, 'Ocean'::character varying::text, 'City'::character varying::text])) NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.hotel_room
    OWNER to postgres;
