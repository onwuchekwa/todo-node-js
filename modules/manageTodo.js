const { pool } = require('../dbConfig');

function getTodos(req, res) {
    const userId = req.user.id;
    pool.query(
      'SELECT * FROM todo WHERE userid = $1', [userId], (err, results, fields) => {
        if(err) {
            throw err;
        }
        res.render('pages/dashboard', { user: req.user.firstname, userId: userId, todos: results.rows });
      }
    )
}

function addTodo(req, res) {
    let { task, userId } = req.body;
    let errors = [];

    if(!task) {
        errors.push({ message: "You must fill enter a task in the field provided." });
    }

    if(errors.length > 0){
        res.render("pages/dashboard", { errors, user: req.user.firstname, userId: userId });
    } else {
        pool.query (
            `INSERT INTO todo (
              task
            , userid
            )
            VALUES
            (
              $1
            , $2 
            )                            
            RETURNING id, task, userid`, [task, userId], (err, result) => {
                if(err) {
                    throw err;
                }
                getTodos(req, res);
            }
        )
    }
}

function updateTodo(req, res) {
    let id = req.query.id;
    let name = req.query.name; 
    if(name === 'pending') {
        pool.query (
            `UPDATE todo SET status = 1 WHERE id = $1 RETURNING status`, [id], (err, results) => {
                if(err) {
                    throw err;
                }
                res.json(results.rows[0])
            }
        )
    } else {
        pool.query (
            `UPDATE todo SET status = 0 WHERE id = $1 RETURNING status`, [id], (err, results) => {
                if(err) {
                    throw err;
                }
                res.json(results.rows[0])
            }
        )
    }
}

function deleteTodo(req, res) {
    let id = req.query.id;
    pool.query (
        `DELETE FROM todo WHERE id = $1 RETURNING id`, [id], (err, results) => {
            if(err) {
                throw err;
            }
            res.json(results.rows[0])
        }
    )
}

module.exports = { getTodos, addTodo, updateTodo, deleteTodo };