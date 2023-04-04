const express = require('express');
const app = express();
const port = 3000;
const ehbs = require('express-handlebars');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');

// Set the view engine to hbs


app.engine('handlebars' , ehbs.engine());
app.set('view engine', 'handlebars');

app.use(
    express.urlencoded({
      extended: true,
    }),
);

app.use(express.json())
app.use(express.static('public'))


app.get('/', (req, res) => {
    res.render('home');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.post("/signup", (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirm_password;
  
    // Check if name is not empty
    if (name === "") {
      return res.status(400).send("Please enter your name.");
    }
  
    // Check if email is valid
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).send("Please enter a valid email address.");
    }
  
    // Check if password is at least 8 characters long
    if (password.length < 8) {
      return res.status(400).send("Password must be at least 8 characters long.");
    }
  
    // Check if password and confirm password match
    if (password !== confirmPassword) {
      return res.status(400).send("Passwords do not match.");
    }
  
    // If all checks pass, create a new user account
    
    // Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const query = `INSERT INTO users (username, email, password, created_at) VALUES (?, ?, ?, current_timestamp())`;
    data = [name, email, hashedPassword];
    connection.query(query, data, (error, results, fields) => {
    if (error) {
        if (error.code === "ER_DUP_ENTRY") {
            // Duplicate email address
            return res.status(400).send("Email address is already registered.");
          } else {
            // Other database error
            console.error(error);
            return res.status(500).send("Error registering user.");
          }
    } 
    else {
      res.render('dashboard');
    }
    });

    // render client dashboard
    
});


app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
  
    // Check if email is valid
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).send("Please enter a valid email address");
    }
  
    // Find the user with the given email
    const query = 'SELECT * FROM users WHERE email = ?';
    connection.query(query, email, (error, results, fields) => {
      if (error) {
        console.error(error);
        res.status(500).send('Error logging in');
      } else {
        if (results.length === 0) {
          // User not found
          res.status(400).send('User not found');
        } else {
          // Compare the password with the hashed password in the database
          const hashedPassword = results[0].password;
          const isPasswordValid = bcrypt.compareSync(password, hashedPassword);
          if (!isPasswordValid) {
            // Incorrect password
            res.status(400).send('Incorrect password');
          } else {
            // Login successful
            res.render('dashboard')
          }
        }
      }
    });
  });
app.get('/dashboard', (req, res) => {
    res.render('dashboard')
});
  

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Xoxo7378',
    database: 'evotech',
    port: 3306
});

connection.connect((err) => {
    if (err) {
        console.log(err);
    } 
    else {
        console.log('Connected to database');
    }
});

// server
app.listen(port , () => {
    console.log(`Server is running on port ${port}`);
}); 