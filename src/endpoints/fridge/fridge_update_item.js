const data = require('../../data.js')
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.handler = (req, res) => {
    // check if the request body is an array
    if (!Array.isArray(req.body)) {
        res.status(400).json({
            message: 'Invalid request was made- No Array.'
        })

        return
    }

    // if the array is empty, return status 200
    if (req.body.length == 0) {
        res.status(200).json({});

        return
    }

    // get the fridge from the database
    data.getFridgeById(req.params.fridge_id).then((fridge) => {
        // iterate all items in the request body
        req.body.forEach((item) => {
            // if the item doesn't exist, create it
            if (!fridge.items.hasOwnProperty(item._id)) {
                fridge.items[item._id] = {
                    _id: item._id,
                    name: item.name,
                    expiry: item.expiry,
                    quantity: item.quantity
                }
            } else {
                // patch the items
                patchIfSet(item, fridge.items[item._id], "name");
                patchIfSet(item, fridge.items[item._id], "expiry");
                patchIfSet(item, fridge.items[item._id], "quantity");
            }
        })

        return data.updateFridge(fridge);
    }).then((fridge) => {
        // status 200
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
        console.log(err)
        res.status(err.statusCode).json({
            message: err.reason
        })
    })
}

function patchIfSet(sourceObj, targetObj, key) {
    if (sourceObj.hasOwnProperty(key))
        targetObj[key] = sourceObj[key];
}
