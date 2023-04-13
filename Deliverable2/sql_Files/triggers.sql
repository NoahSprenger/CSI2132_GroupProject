-- Trigger to enforce a constraint on the hotel_room table to prevent updates that set room_status to an invalid value:

CREATE OR REPLACE FUNCTION validate_room_status()
RETURNS TRIGGER AS $$ 
BEGIN
          IF NEW.room_status NOT IN ('AVAILABLE', 'UNAVAILABLE') THEN 
              RAISE EXCEPTION 'Invalid room status: %', NEW.room_status; 
          END IF; 
          RETURN NEW; 
END; 
$$ LANGUAGE plpgsql; 

CREATE TRIGGER room_status_trigger BEFORE UPDATE ON hotel_room FOR EACH ROW EXECUTE FUNCTION validate_room_status();


-- Trigger to automatically update the capacity column of the hotel_room table based on the number of amenities:

CREATE OR REPLACE FUNCTION update_capacity() 
RETURNS TRIGGER AS $$ 
BEGIN 
           NEW.capacity := CASE 
                 WHEN ARRAY_LENGTH(NEW.amenities, 1) = 1 THEN 'single' 
     WHEN ARRAY_LENGTH(NEW.amenities, 1) = 2 THEN 'double' 
     WHEN ARRAY_LENGTH(NEW.amenities, 1) = 3 THEN 'triple' 
      ELSE 'unknown' 
END; 
RETURN NEW; 
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER capacity_trigger 
BEFORE INSERT OR UPDATE ON hotel_room 
FOR EACH ROW 
EXECUTE FUNCTION update_capacity();
