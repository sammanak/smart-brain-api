const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const database = {
	users: [
		{
			id: '123',
			name: 'John',
			email: 'john@gmail.com',
			password: '123',
			entries: 0,
			join: new Date()
		},
		{
			id: '124',
			name: 'Sally',
			email: 'sally@gmail.com',
			password: '124',
			entries: 0,
			join: new Date()
		}
	],
	login: [
		{
			id: '987',
			hash: '',
			email: 'john@gmail.com'
		}
	]
}

app.get('/', (req, res) => {
	res.send(database.users);
})

// SIGN IN
app.post('/signin', (req, res) => {
	let found = false;
	database.users.forEach(user => {
		if (req.body.email === user.email && req.body.password === user.password) {
			// res.json('success');
			found = true;
			return res.json(user);
		}
	})
	if (!found) {
		res.status(404).json('error signin');
	}
})

// REGISTER
app.post('/register', (req, res) => {
	const { email, name, password } = req.body;
	// bcrypt.hash(password, null, null, function(err, hash) {
 //    console.log(hash);
	// });

	database.users.push(
		{
			id: String(Number(database.users[database.users.length-1].id) + 1),
			name: name,
			email: email,
			password: password,
			entries: 0,
			join: new Date()
		}
	)
	res.json(database.users[database.users.length-1]);
})

// PROFILE
app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	let found = false;
	database.users.forEach(user => {
		if (user.id === id) {
			found = true;
			return res.json(user);
		}
	})
	if (!found) {
		res.status(404).json('not found');
	}
})


app.put('/image', (req, res) => {
	const { id } = req.body;
	let found = false;
	database.users.forEach(user => {
		if (user.id === id) {
			found = true;
			user.entries++;
			return res.json(user.entries);
		}
	})
	if (!found) {
		res.status(400).json('not found');
	}
})


app.listen(3001, () => {
	console.log('app is running on port 3001');
})



/*

/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user

*/