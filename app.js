const express = require('express')
const pg =  require('pg')
const { Pool, Client } = pg
const app = express()
const port = 3000
require('dotenv').config()

app.set('views', __dirname + '/templates');
app.engine('html', require('ejs').renderFile);

// app.use(express.json()); // Add this line to parse JSON bodies
// app.use(express.urlencoded({ extended: true })); // Add this line to parse URL-encoded bodies


app.use(express.static('public'))
//app.set('view engine', 'ejs');

app.use(express.urlencoded());
app.use(express.json());   

app.get('/', async (req, res) => {
  res.render('index.html')
})

app.get('/review', (req, res) => {
    res.render('review.html')
})

app.post('/review', async (req, res) => {
  // console.log(req.body)
  const { username , review, imdb_id } = req.body;
  if (!username || !review || !imdb_id) {
    return res.status(400).send({error:'Username and review are required'});
  }
  const query = `INSERT INTO reviews (username, review, imdb_id) VALUES ('${username.toString()}', '${review.toString()}', '${imdb_id.toString()}')`;

  try {
    const response = await rundbquery(query);
    res.status(201).send({message:'Review added successfully'});
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).send({error:'Failed to add review'});
  }
})

async function rundbquery(query){
    const client = new Client()
    await client.connect()
    let response;
    try {
      response = await client.query(query);
      await client.end()
    } catch (error) {
      console.error('Error executing query:', error);
      await client.end()
      throw error;
    }
    return response
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})