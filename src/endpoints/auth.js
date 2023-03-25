const data = require('../data.js')
const bcrypt = require('bcrypt');
const saltRounds = 10;

// POST /auth/
exports.loginHandle = (req, res) => {
    // check if the request body has the required fields
    if (
        !req.body.hasOwnProperty('email') ||
        !req.body.hasOwnProperty('password')
    ) {
        res.status(400).json({
            message: 'Missing username or password.'
        });

        return
    }

    // fetch the user
    let userData;
    data.getUserByEmail(req.body.email).then((user) => {
        userData = user;
        // check if the password is correct
        return bcrypt.compare(req.body.password, user.password)
    }).then((matches) => {
        if (matches)
            return data.startSession(userData);
        else throw {
            statusCode: 400,
            reason: 'Incorrect email/password.'
        }        
    }).then((user) => {
        // send the user data
        res.status(200).json({
            email: user._id,
            username: user.username,
            fridges: user.fridges,
            token: user.token
        })
    }).catch((err) => {
        // alias the error for a missing database entry
        if (err.reason == "missing") {
            err.statusCode = 400
            err.reason = "Incorrect email/password."
        }

        // send the error
        res.status(err.statusCode).json({
            message: err.reason
        })
    })
}

// DELETE /auth/
exports.logoutHandle = (req, res) => {

}