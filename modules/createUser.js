const bcrypt = require('bcrypt');
const { pool } = require('../dbConfig');
const session = require('express-session');
const flash = require('express-flash');

module.exports = {
    addNewUser: async (req, res) => {
      let { firstname, lastname, username, password, confirm_password } = req.body;

      let errors = [];

      if(!firstname || !lastname || !username || !password || !confirm_password) {
          errors.push({ message: "You must fill enter data into all the fields" });
      }

      if(password.length < 6) {
         errors.push({ message: "Password fields should be at least 6 characters" });
      }

      if(password != confirm_password) {
          errors.push({ message: "Password and Confirm Password fields do not match" });
      }

      if(errors.length > 0){
          res.render("pages/register", { errors });
      } else {
          // Form validations passed
          let hashedPassword = await bcrypt.hash(password, 10);
          
          pool.query (
              `SELECT 
                * 
              FROM login 
              WHERE username = $1`, [username], (err, result) => {
                  if(err) {
                      throw err;
                  }

                  if(result.rows.length > 0) {
                      errors.push({ message: "Username is already in use. Kindly choose another usename." });
                      res.render("pages/register", { errors });
                  } else {
                      pool.query (
                        `INSERT INTO login (
                            username
                        , password
                        , firstname
                        , lastname
                        )
                        VALUES
                        (
                            $1
                        , $2
                        , $3
                        , $4  
                        )                            
                        RETURNING id, username, password`, [username, hashedPassword, firstname, lastname], (err, result) => {
                            if(err) {
                                throw err;
                            } 
                            req.flash('success_msg', "You have registered successfully. Please login");
                            res.redirect("/users/login");
                        }
                      )
                  }
              }
          );
      }
    }
}