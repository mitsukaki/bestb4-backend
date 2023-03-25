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
            else {
                user._rev = body.rev
                resolve(user)
            }
        })
    })
}

exports.deleteUser = (email, rev) => {
    return new Promise((resolve, reject) => {
        users.destroy(email, rev, (err, body) => {
            if (err) reject(err)
            else resolve(body)
        })
    })
}

exports.startSession = (user) => {
    // create a session token
    user.token = uuidv4()

    // update the user
    return new Promise((resolve, reject) => {
        users.insert(user, (err, body) => {
            if (err) reject(err)
            else {
                user._rev = body.rev
                resolve(user)
            }
        })
    })
}

exports.createFridge = () => {
    // create a fridge object
    let fridge = {
        _id: uuidv4(),
        user_ids: [],
        items: {}
    }

    return new Promise((resolve, reject) => {
        fridges.insert(fridge, (err, body) => {
            if (err) reject(err)
            else {
                fridge._rev = body.rev
                resolve(fridge)
            }
        })
    })
}

exports.getFridgeById = (id) => {
    return new Promise((resolve, reject) => {
        fridges.get(id, { revs_info: true }, (err, body) => {
            if (err) reject(err)
            else resolve(body)
        })
    })
}

exports.updateFridge = (fridge) => {
    // upload the new fridge
    return new Promise((resolve, reject) => {
        fridges.insert(fridge, (err, body) => {
            if (err) reject(err)
            else {
                fridge._rev = body.rev
                resolve(fridge)
            }
        })
    })
}

exports.getFridgeItemArray = (fridge) => {
    let items = []

    for (let item in fridge.items)
        items.push(fridge.items[item])

    return items
}