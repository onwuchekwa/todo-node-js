CREATE DATABASE todolistdb;

\c todolistdb

DROP TABLE login CASCADE;
CREATE TABLE login
(
  id SERIAL PRIMARY KEY NOT NULL
, username VARCHAR(65) UNIQUE NOT NULL
, password VARCHAR(255) NOT NULL 
, firstname VARCHAR(30) NOT NULL
, lastname VARCHAR(50)
, createdate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE todo CASCADE;
CREATE TABLE todo
(
  id SERIAL PRIMARY KEY NOT NULL
, task VARCHAR(255) NOT NULL
, status INT NOT NULL DEFAULT 0
, userid INT NOT NULL
, createdate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
, CONSTRAINT fk_todo FOREIGN KEY(userid) 
    REFERENCES login (id)
);

/dt

-- Create User
CREATE USER todolistdbuser WITH PASSWORD 'tododbuseropass';

-- Grant user access to a table
GRANT SELECT, INSERT, UPDATE, DELETE ON login TO todolistdbuser;
GRANT SELECT, INSERT, UPDATE, DELETE ON todo TO todolistdbuser;

-- Grant user access to a sequence
GRANT USAGE, SELECT ON SEQUENCE login_id_seq TO todolistdbuser;
GRANT USAGE, SELECT ON SEQUENCE todo_id_seq TO todolistdbuser;

psql -Utodolistdbuser todolistdb

INSERT INTO login (
  username
, password
, firstname
, lastname 
)
VALUES (
  'donsonde@aol.com'
, 'password'
, 'Martin'
, 'Amidu'
);

INSERT INTO todo (
  task
, userid 
)
VALUES (
  'Read chapter 10 of Java textbook'
, 2
);
