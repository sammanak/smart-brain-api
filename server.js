const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const morgan = require('morgan');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const auth = require('./controllers/authorization');

// https://knexjs.org/
const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  }
});

const app = express();
// console.log('running!Yes!');
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('combined'));

app.get('/', (req, res) => {
  // db.select('*').from('tbusers').then(data => res.send(data));
  res.send('It is Working');
})

// SIGN IN
// app.post('/signin', signin.handleSignin(db, bcrypt))
app.post('/signin', signin.signinAuthentication(db, bcrypt))

// REGISTER
// app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.post('/register', register.rigisterAuthentication(db, bcrypt))

// PROFILE # auth.requireAuth for Authorization Middleware
// app.get('/profile/:id', (req, res) => { profile.handleGetProfile(req, res, db) })
app.get('/profile/:id', auth.requireAuth, (req, res) => { profile.handleGetProfile(req, res, db) })
// app.post('/profile/:id', (req, res) => { profile.handleProfileUpdate(req, res, db) })
app.post('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileUpdate(req, res, db) })

// ENTRIES
// app.put('/image', (req, res) => { image.imageEntriesUpdate(req, res, db) })
app.put('/image', auth.requireAuth, (req, res) => { image.imageEntriesUpdate(req, res, db) })

// API CALL
// app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) })
app.post('/imageurl', auth.requireAuth, (req, res) => { image.handleApiCall(req, res) })

app.listen(process.env.PORT || 3001, () => {
	console.log(`app is running on port' ${process.env.PORT}`);
})