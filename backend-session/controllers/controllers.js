const connection = require('../db/connection');

exports.register = (req, res) => {
    const { username, password } = req.body;
    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
    connection.query(query, [username, password], (err, results) => {
        if (err) throw err;
        res.send('User registered successfully');
    });
};
