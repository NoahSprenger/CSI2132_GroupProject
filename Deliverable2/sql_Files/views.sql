

CREATE VIEW ava_view AS SELECT status, COUNT(*) AS available_rooms FROM hotel_room WHERE "hotel_ID" IN ( SELECT "hotelID" FROM hotel WHERE address LIKE '%Toronto%' ) AND status = TRUE GROUP BY status;

CREATE VIEW room_view AS SELECT "hotel_ID", capacity FROM hotel_room;