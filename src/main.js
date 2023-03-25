// dependencies
const fs = require('fs');
const http = require('http');
const https = require('https');
const multer = require('multer')    
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

// util
const data = require('./data.js')
const upload = multer({ dest: 'uploads/' })
const app = express()
const argv = yargs(hideBin(process.argv)).argv

// endpoints
const auth = require('./endpoints/auth.js')
const user = require('./endpoints/user.js')
const user_create = require('./endpoints/user/user_create.js')
const fridge = require('./endpoints/fridge.js')

// Load SSL data if not devmode
let credentials;
if (!argv.devmode) {
    const privateKey = fs.readFileSync('/etc/letsencrypt/live/bb4.mitsukaki.com/privkey.pem', 'utf8');
    const certificate = fs.readFileSync('/etc/letsencrypt/live/bb4.mitsukaki.com/cert.pem', 'utf8');
    const ca = fs.readFileSync('/etc/letsencrypt/live/bb4.mitsukaki.com/chain.pem', 'utf8');

    credentials = {
        key: privateKey,
        cert: certificate,
        ca: ca
    };
}

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

// Receipt OCR endpoints
app.post('/receipt', upload.single('scan'), (req, res, next) => {
    // req.file is the `scan` file
    // req.body will hold the text fields, if there were any
})

// ping
app.get('/', (req, res) => {
    res.send('API online')
})

let server;
if (argv.devmode) server = http.createServer(app); 
else server = https.createServer(credentials, app);

let port = argv.devmode ? 80 : 443;
server.listen(port, () => {
    if (argv.devmode) console.log('[WARN] Running in devmode!');
    console.log('BestBefore Server running on port ' + port);
});