// get credential string from runtime arguments
const nanoCreds = process.argv[2]
const nanoURL = 'http://admin:' + nanoCreds + ':5984'
const nano = require('nano')(nanoURL)

const users = nano.db.use('users')
const fridges = nano.db.use('fridges')

exports.getUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        users.get(email, (err, body) => {
            if (err) reject(err)
            else resolve(body)
        })
    })
}

exports.createUser = (user) => {
    return new Promise((resolve, reject) => {
        users.insert(user, (err, body) => {
            if (err) reject(err)
            else resolve(body)
        })
    })
}