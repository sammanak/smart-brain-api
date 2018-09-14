const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

// https://knexjs.org/
const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
  	ssl: true,
  }
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
	// db.select('*').from('tbusers').then(data => res.send(data));
	res.send('this is working');
})

// SIGN IN
app.post('/signin', signin.handleSignin(db, bcrypt))

// REGISTER
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })

// PROFILE
app.get('/profile/:id', (req, res) => { profile.handleGetProfile(req, res, db) })

// ENTRIES
app.put('/image', (req, res) => { image.imageEntriesUpdate(req, res, db) })

// API CALL
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) })

// const PORT = process.env.PORT;
// console.log(process.env);

app.listen(process.env.PORT || 3001, () => {
	console.log(`app is running on port' ${process.env.PORT}`);
})

/*
// PLAN
/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user

*/