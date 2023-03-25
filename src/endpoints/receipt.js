const tesseract = require("node-tesseract-ocr")
const { v4: uuidv4 } = require('uuid');
const config = {
    lang: "eng",
    oem: 1,
    psm: 3,
}

const item_regex = /^([a-zA-Z\s\d]+)\s([\d]{5,})/gm

exports.handler = (req, res, next) => {
    // get two weeks from today date in ISO format
    let twoWeeksFromNow = new Date()
    twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14)
    twoWeeksFromNow = twoWeeksFromNow.toISOString()

    tesseract.recognize("uploads/" + req.file.filename, config).then((text) => {
        let items = {}

        // use regex to get all the items
        let matches = text.matchAll(item_regex)

        // add all matches to the items
        for (const match of matches) {
            // if we've seen this item before, increment the quantity
            if (items.hasOwnProperty(match[1])) {
                items[match[1]].quantity += 1
            } else {
                // create the item
                let item = {
                    name: capitalizeWords(match[1].trim()),
                    _id: uuidv4(),
                    expiry: twoWeeksFromNow,
                    quantity: 1
                }

                items[item._id] = item
            }
        }

        // convert the items to an array and send it
        res.status(200).json(Object.values(items))
    })
    .catch((err) => {
        // send the error
        console.log(err)
        res.status(err.statusCode).json({
            message: err.message
        })
    })
}

function capitalizeWords(str) {
    return str
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}