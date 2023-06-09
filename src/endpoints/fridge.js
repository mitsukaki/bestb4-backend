const data = require('../data.js')

// POST /fridge/
exports.createFridgeHandle = (req, res) => {
    data.createFridge().then((fridge) => {
        res.status(200).json(fridge)
    }).catch((err) => {
        // alias the error for a duplicate database entry
        if (err.reason == "Document update conflict.") {
            err.statusCode = 400
            err.reason = "Fridge already exists."
        }

        // send the error
        res.status(err.statusCode).json({
            message: err.reason
        })
    });
}

// DELETE /fridge/:fridge_id/
exports.deleteFridgeHandle = (req, res) => {
    data.getFridgeById(req.params.fridge_id).then((fridge) => {
        return data.deleteFridge(fridge._id, fridge._rev)
    }).then((fridge) => {
        res.status(200).json({})
    }).catch((err) => {
        // send the error
        res.status(err.statusCode).json({
            message: err.reason
        })
    })
}

// GET /fridge/:fridge_id/items/
exports.getFridgeItemsHandle = (req, res) => {
    data.getFridgeById(req.params.fridge_id).then((fridge) => {
        // send back the items
        res.status(200).json(
            data.getFridgeItemArray(fridge)
        )
    }).catch((err) => {
        // alias the error for a missing database entry
        if (err.reason == "missing") {
            err.statusCode = 400
            err.reason = "Fridge not found."
        }

        // send the error
        res.status(err.statusCode).json({
            message: err.reason
        })
    })
}

// DELETE /fridge/:fridge_id/items/
exports.removeFridgeItemsHandle = (req, res) => {
    // get the array of items to delete
    data.getFridgeById(req.params.fridge_id).then((fridge) => {
        req.body.forEach((item) => {
            delete fridge.items[item]
        });

        // update the fridge
        return data.updateFridge(fridge)
    }).then((fridge) => {
        // return the updated list
        res.status(200).json(
            data.getFridgeItemArray(fridge)
        )
    }).catch((err) => {
        // alias the error for a missing database entry
        if (err.reason == "missing") {
            err.statusCode = 400
            err.reason = "Fridge not found."
        }

        // send the error
        res.status(err.statusCode).json({
            message: err.reason
        })
    })
    
}