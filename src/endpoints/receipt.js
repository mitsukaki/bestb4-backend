const tesseract = require("node-tesseract-ocr")
const config = {
    lang: "eng",
    oem: 1,
    psm: 3,
}

exports.handler = (req, res, next) => {
    // req.file is the `scan` file
    // req.body will hold the text fields, if there were any
    console.log(req.file)

    tesseract.recognize("uploads/" + req.file.filename, config).then((text) => {
        console.log(text)

        // status 200
        res.status(200).json(text)
    })
    .catch((err) => {
        //  send the error
        console.log(err)
        res.status(err.statusCode).json({
            message: err.message
        })
    })
}
