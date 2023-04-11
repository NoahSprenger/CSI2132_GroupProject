var nunjucks = require("nunjucks");
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser')
var useragent = require('express-useragent');
const db = require('./db');

var app = express();

nunjucks.configure(path.join(__dirname, 'views'), {
    autoescape: true,
    express: app
});

app.use(express.static(path.join(__dirname, 'public')));
// render the templates
app.use(bodyParser.json());

app.use(useragent.express())

app.get('/', (req, res) => {
    res.render('index.njk', {title: 'Home'});
});

app.get('/Booking', (req, res) => {
    res.render('booking.njk', {title: 'Booking'});
});

app.get('/About', (req, res) => {
    res.render('about.njk', {title: 'About'});
});

app.get('/Contact', (req, res) => {
    res.render('contact.njk', {title: 'Contact'});
});

app.get('/Login', (req, res) => {
    res.render('login.njk', {title: 'Login'});
});

app.get('/SignUp', (req, res) => {
    res.render('signup.njk', {title: 'Sign Up'});
});

app.get('/ResetPassword', (req, res) => {
    res.render('resetpassword.njk', {title: 'Reset Password'});
});



//#############################################################################///
/////////////////////* Searching for rooms queries*///////////////////////////////

// Function to fetch hotel rooms with price within a specified range
const getHotelRoomsByPriceRange = async (minPrice, maxPrice) => {
    try {
      // Query to fetch hotel rooms with price within the specified range
      const query = `
        SELECT * FROM "Hotel_Room"
        WHERE price BETWEEN $1 AND $2;
      `;
      const values = [minPrice, maxPrice];
  
      // Execute the query using the db.query() method from the db module
      const result = await db.query(query, values);
  
      // Return the fetched hotel rooms
      return result.rows;
    } catch (error) {
      console.error('Error fetching hotel rooms:', error);
      throw error;
    }
  };

  // Function to fetch all hotel rooms located in a specific city
const getHotelRoomsByCity = async (city) => {
    try {
      // Query to fetch hotel rooms by city
      const query = `
        SELECT hr.*
        FROM "Hotel_Room" hr
        INNER JOIN "Hotel" h ON hr."hotel_ID" = h."hotelID"
        WHERE h.address ILIKE $1;
      `;
      const values = [`%${city}%`];
  
      const result = await db.query(query, values);
  
      return result.rows;
    } catch (error) {
      console.error('Error fetching hotel rooms by city:', error);
      throw error;
    }
  };

  // Function to fetch all hotel rooms offered by a specific hotel chain
const getHotelRoomsByHotelChain = async (hotelChainName) => {
    try {
      // Query to fetch hotel rooms by hotel chain name       ///NEED TO CHANGE COLUMNE NAMEs??
      const query = `
        SELECT hr.*
        FROM "Hotel_Room" hr
        INNER JOIN "Hotel" h ON hr."hotel_ID" = h."hotelID"
        INNER JOIN "Hotel_Chain" hc ON h."hotelChainID" = hc."hotelChainID"   
        WHERE hc."hotelChainName" = $1;
      `;
      const values = [hotelChainName];
  
      const result = await db.query(query, values);
  
      return result.rows;
    } catch (error) {
      console.error('Error fetching hotel rooms by hotel chain:', error);
      throw error;
    }
  };
  

  // Function to fetch all available hotel rooms offered by a specific hotel
const getHotelRoomsByHotelID = async (hotelID) => {
    try {
      // Query to fetch available hotel rooms by hotelID    ###WE SHOULD ADD ROOM STATUS PROBABLY
      const query = `
        SELECT *
        FROM "Hotel_Room"
        WHERE "hotel_ID" = $1
        AND "room_Status" = 'AVAILABLE';
      `;
      const values = [hotelID];
  
      const result = await db.query(query, values);
  
      return result.rows;
    } catch (error) {
      console.error('Error fetching available hotel rooms by hotel ID:', error);
      throw error;
    }
  };

  // Function to fetch all available hotel rooms with a specific capacity
const getHotelRoomsByCapacity = async (capacity) => {
    try {
      // Query to fetch available hotel rooms by capacity
      const query = `
        SELECT *
        FROM "Hotel_Room"
        WHERE "capacity" = $1
        AND "room_Status" = 'AVAILABLE';
      `;
      const values = [capacity];
  
      const result = await db.query(query, values);
  
      return result.rows;
    } catch (error) {
      console.error('Error fetching available hotel rooms by capacity:', error);
      throw error;
    }
  };

//#############################################################################///
/////////////////////* Getting the 2 different views*/////////////////////////////

/*View 1: Number of available rooms per city (SQL)
-- Create a view that calculates the number of available rooms per city
CREATE OR REPLACE VIEW available_rooms_per_city AS
SELECT
  split_part(h."hotel_Address", ',', 1) AS city,
  COUNT(hr."room_Id") AS num_available_rooms
FROM
  "Hotel_Room" hr
JOIN
  "Hotel" h ON hr."hotel_Id" = h."hotel_Id"
WHERE
  hr."room_Status" = 'AVAILABLE'
GROUP BY
  city; */


// Get number of available rooms per city
const getAvailableRoomsPerCity = async () => {
  try {
    const query = 'SELECT * FROM available_rooms_per_city';
    const { rows } = await db.query(query);
    return rows;
  } catch (err) {
    console.error('Error fetching available rooms per city:', err);
    throw err;
  }
};




/* View 2: Capacity of all rooms of a specific hotel

-- View 2: Total Capacity per Hotel
CREATE OR REPLACE VIEW total_capacity_per_hotel AS
SELECT hotel_id, SUM(capacity) as total_capacity
FROM hotel_room
GROUP BY hotel_id;
    */

  // const db = require('./db'); // assuming you have a db module for database connection

// Get total capacity of all rooms of a specific hotel
const getTotalCapacityPerHotel = async (hotelId) => {
  try {
    const query = 'SELECT * FROM total_capacity_per_hotel WHERE hotel_Id = $1';
    const { rows } = await db.query(query, [hotelId]);
    return rows;
  } catch (err) {
    console.error('Error fetching total capacity per hotel:', err);
    throw err;
  }
};



//#############################################################################///
/////////////////////* user / login / signup queries*/////////////////////////////

//table Users,  that has columns userID, first name, last name, username, email, phone number, password
// Endpoint for inserting user data
app.post('/addUser', (req, res) => {
  // Extracting user data from request body
  // const { userID, first_name, last_name, username, email, phone_number, password } = req.body;

  // Inserting user data into the Users table
  const query = `INSERT INTO "Customer" (full_name, address, SIN, password, email) 
                  VALUES ($1, $2, $3, $4, $5)`;
  const values = [req.body.full_name, req.body.address, req.body.sin, req.body.password, req.body.email];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error inserting user data:', err);
      res.status(500).send('Error inserting user data');
    } else {
      console.log('User data inserted successfully');
      res.status(201).send('User data inserted successfully');
      return res.redirect("/"); //redirect to home page
    }
  });
  res.redirect("/SignUp"); //redirect to signup page
});

// Endpoint for user login
app.post('/Login', (req, res) => {
  // Extracting username and password from request body
  const { username, password } = req.body;

  // Fetching user data from the Users table based on the provided username
  const query = `SELECT * FROM Users WHERE username = $1`;
  const values = [username];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error fetching user data:', err);
      res.status(500).send('Error fetching user data');
    } else {
      // If user data is found
      if (result.rows.length > 0) {
        const user = result.rows[0];

        // Comparing provided password with the hashed password in the database
        bcrypt.compare(password, user.password, (bcryptErr, bcryptResult) => {
          if (bcryptErr) {
            console.error('Error comparing passwords:', bcryptErr);
            res.status(500).send('Error comparing passwords');
          } else {
            // If password matches
            if (bcryptResult) {
              console.log('User logged in successfully:', user.username);
              res.status(200).send('User logged in successfully');
            } else {
              console.log('Incorrect password for user:', user.username);
              res.status(401).send('Incorrect password');
            }
          }
        });
      } else {
        console.log('User not found:', username);
        res.status(404).send('User not found');
      }
    }
  });
});


  // Local Testing
app.listen(3000, function(){
  console.log("Node application started localhost:3000");
});
