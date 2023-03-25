const express = require('express')
const app = express()
const port = 3000

const auth = require('./endpoints/auth.js')
const user = require('./endpoints/user.js')
const fridge = require('./endpoints/fridge.js')

// auth endpoints
app.post('/auth/', auth.loginHandle)
app.delete('/auth/', auth.logoutHandle)

// user endpoints
app.post('/user/', user.createUserHandle)
app.get('/user/:user_id/', user.getUserHandle)
app.put('/user/:user_id/', user.updateUserHandle)
app.delete('/user/:user_id/', user.deleteUserHandle)

// fridge endpoints
app.post('/fridge/', fridge.createFridgeHandle)
app.get('/fridge/:fridge_id/items/', fridge.getFridgeItemsHandle)
app.put('/fridge/:fridge_id/items/', fridge.addFridgeItemsHandle)
app.delete('/fridge/:fridge_id/items/', fridge.removeFridgeItemsHandle)
app.delete('/fridge/:fridge_id/', fridge.removeFridgeHandle)

// ping
app.get('/', (req, res) => {
    res.send('API online')
})

app.listen(port, () => {
    console.log(`BestBefore backend alive on port ${port}`)
})