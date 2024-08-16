const express = require('express');
const crypto = require('crypto');
const pg = require('pg');
const { Client } = pg;
const { v4: uuidv4 } = require('uuid');
const cookieParser = require('cookie-parser'); // Import cookie-parser
const session = require('express-session');
require('dotenv').config();

const app = express();
const port = 3000;

// Initialize sessions object
const sessions = {};

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser()); // Use cookie-parser to handle cookies

// Define a function to hash a password using SHA-1
function hashPassword(password) {
  const hash = crypto.createHash('sha1');
  hash.update(password);
  return hash.digest('hex');
}

app.set('views', __dirname + '/templates');
app.engine('html', require('ejs').renderFile);

// Route handlers
app.get('/', async (req, res) => {
  const sessionID = req.cookies.session;
  const storedSession = sessions[sessionID]

   
  let timeObject = new Date()

  

  if(!sessionID){
    res.redirect("/login")
    return
  }

  if(storedSession.expire.getTime() < timeObject.getTime()){
    res.clearCookie("session")
    res.redirect("/login")
  }


  res.render('index.html');
});

app.get('/review', (req, res) => {
  res.render('review.html');
});

app.get('/login', (req, res) => {
  res.render('login.html');
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = hashPassword(password);

  const query = `SELECT * FROM users WHERE username='${email}' AND password='${hashedPassword}' LIMIT 1`;
  try {
    const response = await rundbquery(query);
    if (response.rowCount === 0) {
      res.status(401).send("User was not found");
      return;
    }
    
    let timeObject = new Date();
    const milliseconds = 3000 * 1000; // 10 seconds = 10000 milliseconds
    timeObject = new Date(timeObject.getTime() + milliseconds);
    const sessionID = uuidv4();
    sessions[sessionID] = { username: email, userID: response.rows[0].id ,expire: timeObject  };

    res.cookie('session', sessionID);
    res.redirect('/');
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send({ error });
  }
});

app.get('/todos', (req, res) => {
  const sessionID = req.cookies.session;
  const userSession = sessions[sessionID];
  if (!userSession) {
    return res.status(401).send('Invalid session');
  }
  const userID = userSession.userID;
  res.send([{
    id: 1,
    title: 'Learn Node',
    userID,
  }]);
});

app.get('/register', (req, res) => {
  res.render('register.html');
});

app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = hashPassword(password);

  const query = `INSERT INTO users (username, password) VALUES ('${email}', '${hashedPassword}')`;
  try {
    await rundbquery(query);
    res.redirect('/login');
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).send({ error: 'Failed to add user' });
  }
});

app.post('/review', async (req, res) => {
  const { review, imdb_id } = req.body;
  const sessionID = req.cookies.session;
  const userSession = sessions[sessionID];

  if (!userSession) {
    return res.status(401).send({ error: 'User not authenticated' });
  }

  const username = userSession.username;
  if (!username || !review || !imdb_id) {
    return res.status(400).send({ error: 'Username, review, and IMDb ID are required' });
  }

  const query = `INSERT INTO reviews (username, review, imdb_id) VALUES ('${username}', '${review}', '${imdb_id}')`;

  try {
    await rundbquery(query);
    res.status(201).send({ message: 'Review added successfully' });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).send({ error: 'Failed to add review' });
  }
});

async function rundbquery(query) {
  const client = new Client();
  await client.connect();
  let response;
  try {
    response = await client.query(query);
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  } finally {
    await client.end();
  }
  return response;
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
