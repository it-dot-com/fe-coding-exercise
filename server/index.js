const co = require('co');
const restify = require('restify');
const bunyan = require('bunyan');
const routes = require('./routes/');
const path = require('path');

const database = require('./common/database');

const PORT = process.env.PORT || 8888;
const DB_FILE = process.env.DB_FILE || './db/weathercal.sqlite';

const log = bunyan.createLogger({
	name: 'weathercal',
	level: process.env.LOG_LEVEL || 'info',
	stream: process.stdout,
	serializers: bunyan.stdSerializers
});

const server = restify.createServer({
	name: 'weathercal',
	log: log
});

server.use(restify.bodyParser({ mapParams: false }));
server.use(restify.queryParser());
server.use(restify.gzipResponse());
server.pre(restify.pre.sanitizePath());

server.on('uncaughtException', function (req, res, err) {
	log.error('Error!');
	log.error(err);
	res.send(500, { success : false });
});

server.on('after', restify.auditLogger({ log: log }));

log.info('Server started.');

co(function*() {
	try {
		const db = yield database.bootstrap(DB_FILE);
		log.info('Database Bootstraped at %s', DB_FILE);

		routes(server, db);

		server.get(/\/docs.*/, restify.serveStatic({
			default: 'api.html',
			directory: path.join(__dirname , '../')
		}));

		server.get(/.*/, restify.serveStatic({
			directory: __dirname + '/public'
		}));

		server.listen(PORT, function () {
			log.info('%s listening at %s', server.name, server.url);
		});
	} catch(e) {
		log.error('Error during startup!');
		log.error(e.message);
	}
});

