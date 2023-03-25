// get credential string from runtime arguments
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv

const nanoURL = 'http://admin:' + argv.dbpass + '@' + argv.dburl + ':5984'
const nano = require('nano')(nanoURL)
const { v4: uuidv4 } = require('uuid');

const users = nano.db.use('users')
const fridges = nano.db.use('fridges')

exports.getUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        users.get(email, { revs_info: true }, (err, body) => {
            if (err) reject(err)
            else resolve(body)
        })
    })
}

exports.createUser = (user) => {
    return new Promise((resolve, reject) => {
        // TODO: ensure user is a valid user object
        users.insert(user, (err, body) => {
            if (err) reject(err)
            else resolve(user)
        })
    })
}

exports.startSession = (user) => {
    // create a session token
    user.token = uuidv4()

    console.log(user)

    // update the user
    return new Promise((resolve, reject) => {
        users.insert(user, (err, body) => {
            if (err) reject(err)
            else resolve(user)
        })
    })
}