const express = require('express')
const pg =  require('pg')
const { Pool, Client } = pg
const app = express()
const port = 3000
require('dotenv').config()

app.set('views', __dirname + '/templates');
app.engine('html', require('ejs').renderFile);

app.use(express.static('public'))
//app.set('view engine', 'ejs');

app.get('/', async (req, res) => {

    // clients will also use environment variables
    // for connection information
    // const client = new Client()
    // await client.connect()
    
    // const ressponse = await client.query('SELECT * FROM users')
    // await client.end()
    // console.log("databse response",ressponse)
   

  res.render('index.html')
})

app.get('/review', (req, res) => {

    res.render('review.html')
  })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})