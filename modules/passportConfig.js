const LocalStrategy = require('passport-local').Strategy;
const { pool } = require('../dbConfig');
const bcrypt = require('bcrypt');

function initialize(passport) {
    const authenticateUser = (username, password, done) => {
        pool.query (
            `SELECT 
            * 
          FROM login 
          WHERE username = $1`, [username], (err, results) => {
              if(err) {
                  throw err;
              }

              if(results.rows.length > 0) {
                  const user = results.rows[0];
                  bcrypt.compare(password, user.password, (err, isMatch) => {
                    if(err) {
                        throw err;
                    } 
                    if(isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: "Invalid credentials. Check your username or password." });
                    }
                  });
              } else {
                return done(null, false, { message: "Invalid credentials. Check your username or password." });
              }
          }
        )
    }

    passport.use(
        new LocalStrategy(
            {
                usernameField: "username",
                passwordField: "password"
            }, 
            authenticateUser
        )
    );
    passport.serializeUser((user, done) => done(null, user.id));

    passport.deserializeUser((id, done) => {
        pool.query(
            `SELECT
               *
            FROM login
            WHERE id = $1`, [id], (err, results) => {
            if (err) {
                return done(err);
            }
            return done(null, results.rows[0]);
        });
    });
}

module.exports = initialize;