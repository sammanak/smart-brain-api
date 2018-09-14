const handleGetProfile = (req, res, db) => {
	const { id } = req.params;
	db.select('*').from('tbusers').where({ id: id })
		.then(user => {
			// console.log(user); // [] --> empty array
			if (user.length) {
				res.json(user[0]);
			} else {
				res.status(400).json('Not Found')
			}
		})
		.catch(error => res.status(400).json('Error getting users'));
}

module.exports = {
	handleGetProfile: handleGetProfile
}