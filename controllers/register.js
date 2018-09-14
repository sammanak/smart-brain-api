const capitalizeEachWords = (str) => str.toLowerCase().replace(/^\w|\s\w/g, (letter) => letter.toUpperCase())

const handleRegister = (req, res, db, bcrypt) => {
	const { email, name, password } = req.body;

	if ( !email || !name || !password) {
		return res.status(400).json('unable to register');
	}

	var hash = bcrypt.hashSync(password);

	db.transaction(trx => {
		trx.insert({
			hash: hash,
			email: email.toLowerCase()
		})
		.into('tblogin')
		.returning('email')
		.then(loginEmail => {
			return trx('tbusers')
				.returning('*')
				.insert({
					name: capitalizeEachWords(name),
					email: loginEmail[0].toLowerCase(),
					joined: new Date()
				})
				.then(user => {
					res.json(user[0]);
				})
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})
	.catch(error => res.status(400).json('unable to register'));
}

module.exports = {
	handleRegister: handleRegister
}