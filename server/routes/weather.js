const request = require('request');
const key = '71fe5e3ea5c0683bb689af630cc5754c';

module.exports = (server) => {
  server.get('/weather/zip/:zip', (req, res, next) => {
		request.get(`http://api.openweathermap.org/data/2.5/weather?zip=${req.params.zip}&appid=${key}`)
			.pipe(res);
		return next();
  });
};
