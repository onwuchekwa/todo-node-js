const express = require('express');
const app = express();
const path = require('path')
const { pool } = require('./dbConfig');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public')
const VIEWS_DIR = path.join(__dirname, 'views');

app
  .use(express.static(PUBLIC_DIR))
  .set('views', VIEWS_DIR)
  .set('view engine', 'ejs')
  .use(express.urlencoded({ extended: false }))
  .get('/', (req, res) => { res.render('pages/index'); })
  .get('/users/login', (req, res) => { res.render('pages/login'); })
  .get('/users/register', (req, res) => { res.render('pages/register'); })
  .get('/users/dashboard', (req, res) => { res.render('pages/dashboard'); })
  .post('/users/register', (req, res) => { 
      let { firstname, lastname, username, password, confirm_password } = req.body;

      console.log({ firstname, lastname, username, password, confirm_password });

      let errors = [];

      if(!firstname || !lastname || !username || !password || !confirm_password) {
          errors.push({ message: "You must fill enter data into all the fields" });

          if(password.length < 6) {
              errors.push({ message: "Password fields should be at least 6 characters" });
          }

          if(password != confirm_password) {
              errors.push({ message: "Password and Confirm Password fields do not match"});
          }

          if(errors.length > 0){
              res.render('pages/register', { errors });
          }
      }
   })
  .listen(PORT, () => { console.log(`Server is running on port ${PORT}`); })

