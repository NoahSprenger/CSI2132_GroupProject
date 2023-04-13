INSERT INTO public."hotel chain" (address, email, chainname, phonenum) VALUES ('7930 Jones Branch Dr, McLean, VA 22102', 'info@hilton.com', 'Hilton', '1-703-883-1000');
INSERT INTO public."hotel chain" (address, email, chainname, phonenum) VALUES ('10400 Fernwood Rd, Bethesda, MD 20817', 'info@marriott.com', 'Marriott', '1-301-380-3000');
INSERT INTO public."hotel chain" (address, email, chainname, phonenum) VALUES ('3 Ravinia Dr #100, Atlanta, GA 30346', 'info@ihg.com', 'IHG', '1-770-604-2000');
INSERT INTO public."hotel chain" (address, email, chainname, phonenum) VALUES ('150 N Riverside Plaza, Chicago, IL 60606', 'info@hyatt.com', 'Hyatt', '1-312-750-1234');
INSERT INTO public."hotel chain" (address, email, chainname, phonenum) VALUES ('22 Sylvan Way, Parsippany, NJ 07054', 'info@wyndham.com', 'Wyndham', '1-973-753-6000');

INSERT INTO public.hotel (address, num_of_rooms, email, rating, "chainID", phonenum)
VALUES
-- Hilton Hotels
('145 Richmond St W, Toronto, ON M5H 2L2, Canada', 400, 'info@hilton.com', 4,1, '416-869-3456'),
('655 Dixon Rd, Etobicoke, ON M9W 1J3, Canada', 600, 'info@hilton.com', 5, 1,'416-674-2222'),
('1177 Airport Blvd, Burlingame, CA 94010, United States', 850, 'info@hilton.com', 4,1, '650-340-8500'),
('1335 Avenue of the Americas, New York, NY 10019, United States', 900, 'info@hilton.com', 5, 1, '212-586-7000'),
('2550 Thousand Oaks Blvd, Memphis, TN 38118, United States', 450, 'info@hilton.com', 3, 1, '901-362-6200'),
-- Marriott Hotels
('525 Bay St, Toronto, ON M5G 2L2, Canada', 300, 'info@marriott.com', 4, 2, '416-597-9200'),
('3800 Wailea Alanui Dr, Kihei, HI 96753, United States', 550, 'info@marriott.com', 5,2, '808-879-1922'),
('110 S Eutaw St, Baltimore, MD 21201, United States', 700, 'info@marriott.com', 4, 2,'410-962-0202'),
('270 Biscayne Blvd Way, Miami, FL 33131, United States', 800, 'info@marriott.com', 5, 2, '305-374-3900'),
('1300 Jefferson Davis Hwy, Arlington, VA 22202, United States', 400, 'info@marriott.com', 3,2, '703-413-5500'),
-- Hyatt Hotels
('370 King St W, Toronto, ON M5V 1J9, Canada', 350, 'info@hyatt.com', 4,4, '416-343-1234'),
('700 Centre St SE, Calgary, AB T2G 5P6, Canada', 600, 'info@hyatt.com', 5,4, '403-717-1234'),
('900 Bellevue Way NE, Bellevue, WA 98004, United States', 800, 'info@hyatt.com', 4,4, '425-462-1234'),
('900 N Michigan Ave, Chicago, IL 60611, United States', 1000, 'info@hyatt.com', 5,4, '312-944-1234'),
('777 Casino Dr, Cherokee, NC 28719, United States', 400, 'info@hyatt.com', 3,4, '828-497-7777'),
-- IHG Hotels
('151 W 54th St, New York, NY 10019, United States', 700, 'info@ihg.com', 5,3, '212-765-8700'),
('600 Main St, Nashville, TN 37206, United States', 400, 'info@ihg.com', 4,3, '615-401-1400'),
('101 Montelago Blvd, Henderson, NV 89011, United States', 600, 'info@ihg.com', 5,3, '702-564-4700'),
('2055 Lincoln Hwy E, Lancaster, PA 17602, United States', 350, 'info@ihg.comis', 3,3, '717-293-9500'),
('2545 Veterans Memorial Pkwy, St Charles, MO 63303, United States', 450, 'info@ihg.com', 4,3, '636-947-1430'),
-- Wyndham Hotels
('3377 Las Vegas Blvd S, Las Vegas, NV 89109, United States', 900, 'info@wyndham.com', 4,5, '702-731-6100'),
('5875 Falls Ave, Niagara Falls, ON L2G 3K7, Canada', 700, 'info@wyndham.com', 5, 5,'905-374-4444'),
('173 Gloucester St, Boston, MA 02115, United States', 500, 'info@wyndham.com', 4,5, '617-267-5300'),
('55 Cyril Magnin St, San Francisco, CA 94102, United States', 800, 'info@wyndham.com', 5,5, '415-398-8900'),
('4751 Lindle Rd, Harrisburg, PA 17111, United States', 350, 'info@wyndham.com', 3,5, '717-939-9100');

INSERT INTO public.hotel_room (views, extendable, damages, "room_ID", "hotel_ID", capacity, amenities)
VALUES
('Mountain', true, 'Minor scratch on the table', 1, 2, 1, ARRAY['TV', 'WiFi']),
('Ocean', false, NULL, 2, 5, 2, ARRAY['TV', 'WiFi', 'Mini Fridge']),
('City', true, 'Broken lamp', 3, 15, 3, ARRAY['TV', 'WiFi', 'Mini Bar']),
('Mountain', false, 'Stained carpet', 4, 12, 1, ARRAY['TV', 'WiFi']),
('City', true, NULL, 5, 21, 2, ARRAY['TV', 'WiFi', 'Mini Fridge']),
('Ocean', false, NULL, 6, 4, 3, ARRAY['TV', 'WiFi', 'Mini Bar']),
('City', true, 'Damaged wall', 7, 19, 1, ARRAY['TV', 'WiFi']),
('Mountain', false, NULL, 8, 8, 2, ARRAY['TV', 'WiFi', 'Mini Fridge']),
('City', true, 'Broken mirror', 9, 24, 3, ARRAY['TV', 'WiFi', 'Mini Bar']),
('Ocean', false, NULL, 10, 16, 1, ARRAY['TV', 'WiFi']),
('City', true, NULL, 36, 19, 1, ARRAY['Air conditioning', 'Free WiFi', 'Minibar', 'Flat-screen TV']),
('Mountain', false, 'Broken lamp', 37, 14, 2, ARRAY['Free WiFi', 'Kitchenette', 'Ironing facilities']),
('City', true, NULL, 38, 22, 1, ARRAY['Air conditioning', 'Flat-screen TV', 'Coffee machine']),
('Ocean', false, 'Scratched table', 39, 18, 3, ARRAY['Balcony', 'Sea view', 'Free toiletries']),
('Mountain', false, 'Stained carpet', 40, 23, 2, ARRAY['Air conditioning', 'Free WiFi', 'Minibar']),
('City', true, NULL, 41, 16, 1, ARRAY['Flat-screen TV', 'Coffee machine', 'Hairdryer']),
('Ocean', true, NULL, 42, 25, 3, ARRAY['Balcony', 'Sea view', 'Free toiletries', 'Kitchen']),
('City', false, 'Cracked window', 43, 20, 2, ARRAY['Air conditioning', 'Free WiFi', 'Minibar']),
('Mountain', true, NULL, 44, 24, 1, ARRAY['Flat-screen TV', 'Coffee machine', 'Hairdryer']),
('City', false, 'Stained sheets', 45, 21, 3, ARRAY['Air conditioning', 'Free WiFi', 'Minibar', 'Ironing facilities']),
('City', false, NULL, 46, 5, 1, ARRAY['Free Wi-Fi', 'Mini fridge', 'Safe']),
('Ocean', true, 'Scratched nightstand', 47, 14, 2, ARRAY['Free Wi-Fi', 'Coffee maker', 'Iron and ironing board']),
('City', false, NULL, 48, 1, 1, ARRAY['Free Wi-Fi', 'Flat-screen TV', 'Hair dryer']),
('Mountain', true, NULL, 49, 20, 3, ARRAY['Free Wi-Fi', 'Air conditioning', 'Mini fridge']),
('Ocean', false, NULL, 50, 8, 2, ARRAY['Free Wi-Fi', 'Safe', 'Coffee maker']),
('City', true, NULL, 51, 15, 1, ARRAY['Free Wi-Fi', 'Flat-screen TV', 'Iron and ironing board']),
('Ocean', true, 'Stained carpet', 52, 3, 2, ARRAY['Free Wi-Fi', 'Coffee maker', 'Hair dryer']),
('Mountain', false, NULL, 53, 23, 1, ARRAY['Free Wi-Fi', 'Air conditioning', 'Mini fridge']),
('City', true, 'Broken mirror', 54, 6, 3, ARRAY['Free Wi-Fi', 'Flat-screen TV', 'Coffee maker']);
