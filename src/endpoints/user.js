// GET /user/:user_id/
exports.getUserHandle = (req, res) => {
    res.send(req.params)
}

// PUT /user/:user_id/
exports.updateUserHandle = (req, res) => {
    // TODO: update user fridges
}

// DELETE /user/:user_id/
exports.deleteUserHandle = (req, res) => {
    // TODO: delete user
}