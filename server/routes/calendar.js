module.exports = (server, db) => {
	server.get('/events', (req, res, next) => {
		db.all('select rowid as id, title, description, zipcode, date from events')
			.then((events) => {
				res.json(events);
				next();
			})
			.catch((err) => {
				res.status(500).send(err);
			});
	});
	server.get('/events/:id', (req, res, next) => {
		db.get('select * from events where rowid = ?', [req.params.id]).then((event) => {
			if (!event) res.send(404);
			else res.json({
				id: event.rowid,
				title: event.title,
				description: event.description,
				zipcode: event.zipcode,
				date: event.date
			});
			next();
		})
		.catch((err) => {
			res.status(500).send(err);
		});
	});
	server.post('/events', (req, res, next) => {
		var { title, description, zipcode, date } = req.body;
		db.run('insert into events (title, description, zipcode, date) values (?, ?, ?, ?)',
			[title, description, zipcode, date]
		)
			.then((data) => {
				res.json(Object.assign({}, req.body, { id: data.lastID }));
				next();
			})
			.catch((err) => {
				res.status(500).send(err);
			});
	});
	server.put('/events/:id', (req, res, next) => {
		var { title, description, zipcode, date } = req.body;
		db.run(
			'update events set title = ?, description = ?, zipcode = ?, date = ? where rowid = ?',
			[title, description, zipcode, date, req.params.id]
		)
			.then((data) => {
				res.json(req.body);
				next();
			})
			.catch((err) => {
				res.status(500).send(err);
			});
	});
};
