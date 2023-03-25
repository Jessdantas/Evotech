const express = require('express');
const app = express();
const port = 3000;
const ehbs = require('express-handlebars');
const mysql = require('mysql');


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

app.get('/login', (req, res) => {
    res.render('login');
});

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'evotech'
});

connection.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Connected to database');
    }
    app.listen(port , () => {
  console.log(`Server is running on port ${port}`);
    }); 
});
