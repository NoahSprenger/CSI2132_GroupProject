var nunjucks = require("nunjucks");
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser')
var bcrypt = require('bcrypt');
var useragent = require('express-useragent');
const db = require('./db');
const session = require('express-session');

const saltRounds = 10;

var app = express();

nunjucks.configure(path.join(__dirname, 'views'), {
  autoescape: true,
  express: app
});

app.use(session({
  secret: 'mySecretKey',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
app.use(express.static(path.join(__dirname, 'public')));
// render the templates
app.use(bodyParser.json());
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(useragent.express())

app.get('/', (req, res) => {
  res.render('index.njk', { title: 'Home' });
});

app.get('/Booking', (req, res) => {
  res.render('booking.njk', { title: 'Booking' });
});

app.get('/About', (req, res) => {
  res.render('about.njk', { title: 'About' });
});

app.get('/Contact', (req, res) => {
  res.render('contact.njk', { title: 'Contact' });
});

app.get('/Login', (req, res) => {
  res.render('login.njk', { title: 'Login' });
});

app.get('/Logout', requireLogin, (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.get('/EmployeeLogin', (req, res) => {
  res.render('employeelogin.njk', { title: 'Employee Login' });
});

function requireLogin(req, res, next) {
  if (req.session && req.session.loggedIn) {
    return next();
  } else {
    res.redirect('/Login');
  }
}

function requireEmployee(req, res, next) {
  if (req.session && req.session.employeeLoggedIn) {
    return next();
  } else {
    res.redirect('/EmployeeLogin');
  }
}

app.get('/EmployeeInterface', requireEmployee, (req, res) => {
  res.render('employee.njk', { title: 'Employee Interface' });
});

app.get('/Book/:roomId', requireLogin, (req, res) => {
  const roomId = req.params.roomId;
  db.query(`SELECT * FROM hotel_room WHERE "room_ID" = ${roomId}`, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.render('book.njk', { title: 'Book', room: result.rows[0], email: req.session.email, name: req.session.name });
    }
  });
});

app.get('/Rent/:roomId', requireEmployee, (req, res) => {
  const roomId = req.params.roomId;
  db.query(`SELECT * FROM hotel_room WHERE "room_ID" = ${roomId}`, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.render('rent.njk', { title: 'Rent', room: result.rows[0], eSIN: req.session.sin });
    }
  });
});


app.get('/SignUp', (req, res) => {
  res.render('signup.njk', { title: 'Sign Up' });
});

app.get('/ResetPassword', (req, res) => {
  res.render('resetpassword.njk', { title: 'Reset Password' });
});

// Handle the form submission and render the available rooms table
app.get('/getBookings', async (req, res) => {
  let conditions = 0;
  const startDate = req.query.start_date;
  // if (startDate != '') {
  //   conditions++;
  // }
  const endDate = req.query.end_date;
  // if (endDate != '') {
  //   conditions++;
  // }
  const roomCapacity = req.query.room_capacity;
  if (roomCapacity != '') {
    conditions++;
  }
  const area = req.query.area;
  if (area != '') {
    conditions++;
  }
  const hotelChain = req.query.hotel_chain;
  if (hotelChain != '') {
    conditions++;
  }
  const hotelCategory = req.query.hotel_category;
  // if (hotelCategory != '') {
  //   conditions++;
  // }
  const totalRooms = req.query.total_rooms;
  // if (totalRooms != '') {
  //   conditions++;
  // }
  const priceMin = req.query.price_min;
  const priceMax = req.query.price_max;
  if (priceMin != '' && priceMax != '') {
    conditions++;
  }

  const rooms = await getAvailableRooms(startDate, endDate, roomCapacity, area, hotelChain, hotelCategory, totalRooms, priceMin, priceMax, conditions);

  res.json(rooms);
});

const getAvailableRooms = async (startDate, endDate, roomCapacity, area, hotelChain, hotelCategory, totalRooms, priceMin, priceMax, conditions) => {
  let availableRooms = [];
  let tempArray = [];
  try {
    tempArray = await getHotelRoomsByPriceRange(priceMin, priceMax);
    tempArray.forEach((item) => {
      availableRooms.push(item);
    })
  } catch (err) {
    console.log(err);
  }
  try {
    tempArray = await getHotelRoomsByCapacity(roomCapacity);
    tempArray.forEach((item) => {
      availableRooms.push(item);
    })
  } catch (err) {
    console.log(err);
  }
  try {
    tempArray = await getHotelRoomsByCity(area);
    tempArray.forEach((item) => {
      availableRooms.push(item);
    })
  } catch (err) {
    console.log(err);
  }

  try {
    tempArray = await getHotelRoomsByHotelChain(hotelChain);
    tempArray.forEach((item) => {
      availableRooms.push(item);
    })
  } catch (err) {
    console.log(err);
  }

  const count = {};
  var fourOccurrences = [];
  // Loop through the array
  // Loop through the rows of each QueryResult object
  for (const row of availableRooms) {
    // Extract the value you want to count occurrences of
    const value = row.room_ID;

    // Increment the count for this value
    count[value] = (count[value] || 0) + 1;

    if (count[value] === conditions) {
      fourOccurrences.push(row);
    }
  }

  availableRooms = fourOccurrences;
  return availableRooms
}

app.post('/bookingRenting', requireEmployee, urlencodedParser, async (req, res) => {

  const query = `SELECT * FROM booking WHERE "c_SIN" = $1`;

  const values = [req.body.customerSIN];
  await db.query(query, values, (err, result) => {
    if (err) {
      console.log(err);
      return res.redirect("/EmployeeInterface");
    }
    if (result.rows.length > 0) {
      const query2 = `INSERT INTO renting (room_id, hotel_id, "c_SIN", "e_SIN")
      VALUES ($1, $2, $3, $4)`;
      const room_id = result.rows[0].room_id;
      const hotel_id = result.rows[0].hotel_id;
      const checkInDate = result.rows[0].check_in;
      const checkOutDate = result.rows[0].check_out;
      const values2 = [room_id, hotel_id, req.body.customerSIN, req.session.sin];

      db.query(query2, values2, (err, result) => {
        if (err) {
          console.log(err);
          return res.redirect("/EmployeeInterface");
        }
        const query3 = `DELETE FROM booking WHERE "c_SIN" = $1`;
        const values3 = [req.body.customerSIN];
        db.query(query3, values3, (err, result) => {
          if (err) {
            console.log(err);
            return res.redirect("/EmployeeInterface");
          }
            // create the archive
          const query4 = `INSERT INTO archive ("hotel_ID", "c_SIN", "e_SIN", check_in, check_out)
          VALUES ($1, $2, $3, $4, $5)`;
          const values4 = [hotel_id, req.body.customerSIN, req.session.sin, checkInDate, checkOutDate];
          db.query(query4, values4, (err, result4) => {
            if (err) {
              console.log(err);
              return res.redirect("/EmployeeInterface");
            }
          });
        });
      });
    } else {
      return res.redirect("/EmployeeInterface");
    }
  });
  return res.render("thankyou.njk", { title: 'Thank You' });
});

app.post('/rentRoom', requireLogin, urlencodedParser, (req, res) => {
  const query = `UPDATE hotel_room SET status = false WHERE "room_ID" = $1`;
  const values = [req.body.roomID];
  db.query(query, values, (err, result) => {
    if (err) {values4
      console.log(err);
      return res.redirect("/Rent/" + req.body.roomId);
    }
  });
  // create the booking
  const query2 = `INSERT INTO renting (room_id, hotel_id, "c_SIN", "e_SIN")
  VALUES ($1, $2, $3, $4)`;
  const values2 = [req.body.roomID, req.body.hotelID, req.body.cSIN, req.session.sin];
  db.query(query2, values2, (err, result) => {
    if (err) {
      console.log(err);
      return res.redirect("/Rent/" + req.body.roomId);
    }
  });
  // create the archive
  const query3 = `INSERT INTO archive ("hotel_ID", "c_SIN", "e_SIN", check_in, check_out)
  VALUES ($1, $2, $3, $4, $5)`;
  const values3 = [req.body.hotelID, req.body.cSIN, req.session.sin, req.body.checkInDate, req.body.checkOutDate];
  db.query(query3, values3, (err, result) => {
    if (err) {
      console.log(err);
      return res.redirect("/Rent/" + req.body.roomId);
    }
  });
  return res.render("thankyou.njk", { title: 'Thank You' });
});

app.post('/bookRoom', requireLogin, urlencodedParser, (req, res) => {
  const query = `UPDATE hotel_room SET status = false WHERE "room_ID" = $1`;
  const values = [req.body.roomID];
  db.query(query, values, (err, result) => {
    if (err) {
      console.log(err);
      return res.redirect("/Book/" + req.body.roomId);
    }
  });
  // create the booking
  const query2 = `INSERT INTO booking (room_id, hotel_id, check_in, check_out, "c_SIN")
  VALUES ($1, $2, $3, $4, $5)`;
  const values2 = [req.body.roomID, req.body.hotelID, req.body.checkInDate, req.body.checkOutDate, req.session.sin];
  db.query(query2, values2, (err, result) => {
    if (err) {
      console.log(err);
      return res.redirect("/Book/" + req.body.roomId);
    }
  });
  return res.render("thankyou.njk", { title: 'Thank You' });
});


app.get('/SignUpEmployee', (req, res) => {
  res.render('signupemployee.njk', { title: 'Sign Up Employee' });
});

// Employee signup
app.post('/addEmployee', urlencodedParser, (req, res) => {
  const query = `INSERT INTO employees ("SIN", role, full_name, address, email, password) 
                  VALUES ($1, $2, $3, $4, $5, $6)`;
  (async () => {
    const hash2 = await bcrypt.hash(req.body.password, saltRounds);
    // Store hash in your password DB.
    const values = [req.body.sin, req.body.role, req.body.full_name, req.body.address, req.body.email, hash2];

    db.query(query, values, (err, result) => {
      if (err) {
        console.log('Error inserting employee data:', err);
        return res.redirect("/SignUpEmployee");
      }
    })
  })();
  return res.redirect("/"); //redirect to home page
});

// User signup
app.post('/addUser', urlencodedParser, (req, res) => {
  const query = `INSERT INTO customers (full_name, address, "SIN", password, email) 
                  VALUES ($1, $2, $3, $4, $5)`;
  (async () => {
    const hash2 = await bcrypt.hash(req.body.password, saltRounds);
    // Store hash in your password DB.
    const values = [req.body.full_name, req.body.address, req.body.sin, hash2, req.body.email];

    db.query(query, values, (err, result) => {
      if (err) {
        console.log('Error inserting user data:', err);
        return res.redirect("/SignUp");
      }
    })
  })();
  return res.redirect("/"); //redirect to home page
});

// Employee Login
app.post('/loginEmployee', urlencodedParser, (req, res) => {
  // Extracting username and password from request body

  // Fetching user data from the Users table based on the provided username
  const query = `SELECT * FROM employees WHERE email = $1`;
  const values = [req.body.email];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error fetching user data:', err);
      res.status(500).send('Error fetching user data');
    } else {
      // If user data is found
      if (result.rows.length > 0) {
        const user = result.rows[0];

        // Comparing provided password with the hashed password in the database
        bcrypt.compare(req.body.password, user.password, (bcryptErr, bcryptResult) => {
          if (bcryptErr) {
            console.error('Error comparing passwords:', bcryptErr);
            res.status(500).send('Error comparing passwords');
          } else {
            // If password matches
            if (bcryptResult) {
              req.session.sin = user.SIN;
              req.session.employeeLoggedIn = true;
              req.session.loggedIn = true;
              req.session.save((err) => {
                if (err) {
                  console.error('Error saving session:', err);
                } else {
                  console.log('Session saved successfully');
                }
              });
            } else {
              console.log('Incorrect password for user:', user.username);
              // res.status(401).send('Incorrect password');
              return res.redirect("/Login");
            }
          }
        })
      } else {
        console.log('User not found:');
        // res.status(404).send('User not found');
      }
    }
  })
  return res.redirect("/"); //redirect to home page
});

// Customer Login
app.post('/loginCustomer', urlencodedParser, (req, res) => {
  // Extracting username and password from request body

  // Fetching user data from the Users table based on the provided username
  const query = `SELECT * FROM customers WHERE email = $1`;
  const values = [req.body.email];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error fetching user data:', err);
      res.status(500).send('Error fetching user data');
    } else {
      // If user data is found
      if (result.rows.length > 0) {
        const user = result.rows[0];

        // Comparing provided password with the hashed password in the database
        bcrypt.compare(req.body.password, user.password, (bcryptErr, bcryptResult) => {
          if (bcryptErr) {
            console.error('Error comparing passwords:', bcryptErr);
            res.status(500).send('Error comparing passwords');
          } else {
            // If password matches
            if (bcryptResult) {
              req.session.email = req.body.email;
              req.session.sin = user.SIN;
              req.session.name = user.full_name;
              req.session.loggedIn = true;
              req.session.save((err) => {
                if (err) {
                  console.error('Error saving session:', err);
                } else {
                  console.log('Session saved successfully');
                }
              });
            } else {
              console.log('Incorrect password for user:', user.email);
              // res.status(401).send('Incorrect password');
              return res.redirect("/Login");
            }
          }
        })
      } else {
        console.log('User not found:', username);
        // res.status(404).send('User not found');
      }
    }
  })
  return res.redirect("/"); //redirect to home page
});

//#############################################################################///
/////////////////////* Searching for rooms queries*///////////////////////////////

// Function to fetch hotel rooms with price within a specified range
const getHotelRoomsByPriceRange = async (minPrice, maxPrice) => {
  try {
    // Query to fetch hotel rooms with price within the specified range
    const query = `
        SELECT * FROM hotel_room
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
      SELECT *
      FROM hotel_room
      WHERE "hotel_ID" IN (
          SELECT "hotelID"
          FROM hotel
          WHERE address LIKE $1
      );
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
      FROM hotel_room hr
      INNER JOIN hotel h ON h."hotelID" = hr."hotel_ID"
      INNER JOIN "hotel chain" hc ON hc."chainID" = h."chainID"
      WHERE hc.chainname = $1;
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
        FROM hotel_room
        WHERE "hotel_ID" = $1
        AND status = true;
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
        FROM hotel_room
        WHERE "capacity" = $1
        AND status = true;
      `;
    const values = [capacity];

    const result = await db.query(query, values);

    return result.rows;
  } catch (error) {
    console.error('Error fetching available hotel rooms by capacity:', error);
    throw error;
  }
};


//Function to fetch all available hotel rooms with a specific category(ratings[1,2,3,4,5])
const getRoomsByHotelRating = async (rating) => {
  try {
    const query = `SELECT hr.* 
                   FROM hotel_room hr
                   JOIN hotel h ON hr.hotel_ID = h."hotelID"
                   WHERE h.rating = $1 AND hr.room_Status = 'AVAILABLE';`;
    const result = await db.any(query, [rating]);
    return result;
  } catch (err) {
    console.error('Error fetching rooms by hotel rating:', err);
    throw err;
  }
};
//Function to fetch all avaible rooms by date range
const getAvailableRoomsByDateRange = async (startDate, endDate) => {
  try {
    const query = `SELECT hr.*
                   FROM hotel_room hr
                   LEFT JOIN booking b ON hr."room_ID" = b.room_id AND b.check_out > $1 AND b.check_in < $2
                   WHERE b.room_id IS NULL AND hr.room_status = 'AVAILABLE';`;
    const result = await db.any(query, [startDate, endDate]);
    return result;
  } catch (err) {
    console.error('Error fetching available rooms by date range:', err);
    throw err;
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

app.listen(3000, function () {
  console.log("Node application started localhost:3000");
});
