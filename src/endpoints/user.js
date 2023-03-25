const data = require('../data.js')

// GET /user/:user_id/
exports.getUserHandle = (req, res) => {
    data.getUserByEmail(req.params.user_id).then((user) => {
        res.status(200).json({
            _id: user._id,
            username: user.username,
            fridges: user.fridges
        })
    }).catch((err) => {
        // alias the error for a missing database entry
        if (err.reason == "missing") {
            err.statusCode = 400
            err.reason = "User not found."
        }

        // send the error
        res.status(err.statusCode).json({
            message: err.reason
        })
    })
}

// PUT /user/:user_id/
exports.updateUserHandle = (req, res) => {
    // TODO: update user fridges
}

// DELETE /user/:user_id/
exports.deleteUserHandle = (req, res) => {
    data.getUserByEmail(req.params.user_id).then((user) => {
        return data.deleteUser(user._id, user._rev)
    }).then((User) => {
        res.status(200).json({})
    }).catch((err) => {
        // send the error
        res.status(err.statusCode).json({
            message: err.reason
        })
    })
}
       
       
     
