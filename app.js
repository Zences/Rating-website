const express = require('express')
const crypto = require('crypto');
const pg =  require('pg')
const { Pool, Client } = pg
const app = express()
const port = 3000
require('dotenv').config()

// Define a function to hash a password using SHA-1
function hashPassword(password) {
  // Create a SHA-1 hash object
  const hash = crypto.createHash('sha1');
  
  // Update the hash with the password (encoded as a string)
  hash.update(password);
  
  // Generate the hash digest in hexadecimal format
  const hashedPassword = hash.digest('hex');
  
  return hashedPassword;
}

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


//This is the route to the login page
app.get('/login', (req, res) => {
  res.render('login.html')
})

app.post('/login', async (req, res) => {
  const { email , password } = req.body;
  const hashedPassword = hashPassword(password)

  const query = `SELECT * FROM users WHERE username='${email}' AND password='${hashedPassword}' LIMIT 1`
  try {
    const response = await rundbquery(query);
    if(response.rowCount==0){
      res.status(401).send("User was not found");
      return
    }
    res.redirect("/")
    // res.status(200).send({error:'Login succesful'});
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).send({error});
  }
})

//This is the route to the register page
app.get('/register', (req, res) => {
  res.render('register.html')
})



app.post('/register', async (req, res) => {
  const { email , password } = req.body;
  const hashedPassword = hashPassword(password)

  const query = `INSERT INTO users (username,password) VALUES ('${email}','${hashedPassword}')`
  try {
    const response = await rundbquery(query);
    res.redirect("/login")
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).send({error:'Failed to add user'});
  }
})

//THis route handles saving of reviews to the database
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