const data = require('../../data.js')
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.handler = (req, res) => {
    // check if the request body is an array
    if (!Array.isArray(req.body)) {
        res.status(400).json({
            message: 'Invalid request was made- No Array.'
        });

        return
    }

    // if the array is empty, return status 200
    if (req.body.length == 0) {
        res.status(200).json({});

        return
    }

    // 
