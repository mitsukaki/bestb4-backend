const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

const data = require('./data.js')

const auth = require('./endpoints/auth.js')
const user = require('./endpoints/user.js')
const user_create = require('./endpoints/user/user_create.js')
const fridge = require('./endpoints/fridge.js')

// parse the request body with JSON
app.use(bodyParser.json())

// enable CORS
app.use(cors())

// auth endpoints
app.post('/auth/', auth.loginHandle)
app.delete('/auth/', auth.logoutHandle)

// user endpoints
app.post('/user/', user_create.handler) // POST /user/
app.get('/user/:user_id/', user.getUserHandle) // GET /user/:user_id/
app.put('/user/:user_id/', user.updateUserHandle) // PUT /user/:user_id/
app.delete('/user/:user_id/', user.deleteUserHandle) // DELETE /user/:user_id/

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