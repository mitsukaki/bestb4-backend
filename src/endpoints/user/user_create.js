const data = require('../../data.js')
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.handler = (req, res) => {
    // check if the request body has the required fields
    if (
        !req.body.hasOwnProperty('username') ||
        !req.body.hasOwnProperty('email') ||
        !req.body.hasOwnProperty('password')
    ) {
        res.status(400).json({
            message: 'Missing username, email, or password.'
        });

        return
    }

    // hash the password
    bcrypt.hash(req.body.password, saltRounds).then((hash) => {
        return data.createFridge();
    }).then((fridge) => {
        // create the user
        return data.createUser({
            _id: req.body.email,
            username: req.body.username,
            password: hash,
            fridges: [fridge._id]
        })
    }).then((user) => {
        // sign the user in
        return data.startSession(user);
    }).then((user) => {
        // return the user data
        res.status(200).json({
            email: user._id,
            username: user.username,
            fridges: user.fridges,
            token: user.token
        })
    }).catch((err) => {
        // alias the error for a duplicate database entry
        if (err.reason == "Document update conflict.") {
            err.statusCode = 400
            err.reason = "Email already in use."
        }

        // send the error
        res.status(err.statusCode).json({
            message: err.reason
        })
    })
}