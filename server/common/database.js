const co = require('co');
const sqlite3 = require('co-sqlite3');
const testData = require('./test-data');

const bootstrap = co.wrap(function*(file) {
	const db = yield sqlite3(file);
	
	yield db.run(
		`create table if not exists events (
			rowid integer primary key autoincrement,
			title text, 
			description text,
			zipcode int,
			date int)`
	);

	const existingRecords = yield db.all('select * from events');

	if (!existingRecords.length) {
		yield createTestRecords(db);
	}

	return db;
});

const createTestRecords = co.wrap(function*(db) {
	const stmt = yield db.prepare(
		`insert into events 
		 (title, description, zipcode, date) 
		 values (?, ?, ?, ?)`
	);
	for (let i = 0; i < testData.length; i++) {
		let { title, description, zipcode, date } = testData[i];
		yield stmt.run(title, description, zipcode, date);
	}
});

module.exports = { bootstrap };
