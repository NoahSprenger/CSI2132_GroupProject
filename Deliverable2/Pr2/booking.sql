-- Table: public.booking

-- DROP TABLE IF EXISTS public.booking;

CREATE TABLE IF NOT EXISTS public.booking
(
    room_id integer NOT NULL,
    hotel_id integer NOT NULL,
    check_in date NOT NULL,
    check_out date NOT NULL,
    "c_SIN" integer NOT NULL,
    CONSTRAINT "Booking_pkey" PRIMARY KEY (check_out, check_in),
    CONSTRAINT check_in UNIQUE (check_in),
    CONSTRAINT check_out UNIQUE (check_out),
    CONSTRAINT "c_SIN" FOREIGN KEY ("c_SIN")
        REFERENCES public.customers ("SIN") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT hotel_id FOREIGN KEY (hotel_id)
        REFERENCES public.hotel ("hotelID") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT room_id FOREIGN KEY (room_id)
        REFERENCES public.hotel_room ("room_ID") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.booking
    OWNER to postgres;