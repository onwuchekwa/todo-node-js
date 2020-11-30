const express = require('express');
const app = express();
const path = require('path')
const { pool } = require('./dbConfig');
const session = require('express-session');
const flash = require('express-flash');
const createUser = require('./modules/createUser');
const passport = require('passport');
const initializedPassport = require('./modules/passportConfig');
const checkStatus = require('./modules/checkStatus');
const manageTodo = require('./modules/manageTodo');
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public')
const VIEWS_DIR = path.join(__dirname, 'views');

initializedPassport(passport);

app
  .use(express.static(PUBLIC_DIR))
  .set('views', VIEWS_DIR)
  .set('view engine', 'ejs')
  .use(express.urlencoded({ extended: false }))
  .use(session({ 
    store: new (require('connect-pg-simple')(session))(),
    secret: 'secret', 
    resave: false, 
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }
  }))
  .use(passport.initialize())
  .use(passport.session())
  .use(flash())
  .get('/', (req, res) => { res.render('pages/index'); })
  .get('/users/login', checkStatus.checkAuthenticated, (req, res) => { res.render('pages/login'); })
  .get('/users/register', checkStatus.checkAuthenticated, (req, res) => { res.render('pages/register'); })
  .get('/users/dashboard', checkStatus.checkNotAuthenticated, (req, res) => {  
    manageTodo.getTodos(req, res) 
  })
  .get('/users/logout', (req, res) => { 
      req.logOut(), 
      req.flash("success_msg", "You have logged out successfully"),
      res.redirect('/users/login')
    })
  .post('/users/register', (req, res) => { createUser.addNewUser(req, res) })
  .post('/users/login', passport.authenticate('local', { 
      successRedirect: "/users/dashboard", 
      failureRedirect: "/users/login",
      failureFlash: true    
    }))
    .post('/users/dashboard', (req, res) => { 
      manageTodo.addTodo(req, res)
     })
     .put('/users/dashboard', (req, res) => { 
      manageTodo.updateTodo(req, res)
     })
     .delete('/users/dashboard', (req, res) => { 
      manageTodo.deleteTodo(req, res)
     })
  .listen(PORT, () => { console.log(`Server is running on port ${PORT}`); })

