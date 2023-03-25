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

// GET /fridge/:fridge_id/items/
exports.getFridgeItemsHandle = (req, res) => {
    data.getFridgeById(req.params.fridge_id).then((fridge) => {
        let items = [];

        // convert items to an array
        fridge.items.forEach((item) => items.push)

        // send back the items
        res.status(200).json(items)
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

// PUT /fridge/:fridge_id/items/
exports.updateFridgeItemsHandle = (req, res) => {
    
}

// DELETE /fridge/:fridge_id/items/
exports.removeFridgeItemsHandle = (req, res) => {
    // TODO: delete fridge items
}

// DELETE /fridge/:fridge_id/
exports.removeFridgeHandle = (req, res) => {
    // TODO: delete fridge
}