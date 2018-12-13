const handleSignin = (db, bcrypt) => (req, res) => {
	const { email, password } = req.body;

	if ( !email || !password) {
		return res.status(400).json('unable to signin');
	}

	db.select('email', 'hash').from('tblogin')
		.where('email', '=', email.toLowerCase())
		.then(data => {
			const isValid = bcrypt.compareSync(password, data[0].hash);
			if (isValid) {
				return db.select('*').from('tbusers').where('email', '=', email.toLowerCase())
					.then(user => {
						// console.log(isValid);
						res.json(user[0]);
					})
					.catch(error => res.status(400).json('Unable to get user'))
			} else {
				res.status(400).json('Wrong credential')
			}
		})
			.catch(error => res.status(400).json('Error wrong credential'))
}

module.exports = {
	handleSignin: handleSignin
}