const mysql = require('mysql');
var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var shell      = require('node-cmd');
var tcp        = require('tcp-proxy');

var pool = mysql.createPool({
    connectionLimit : 10, // default = 10
    host            : 'localhost',
    port            : '10001',
    user            : 'idp',
    password        : 'Idp_1234',
    database        : 'iith_ems'
});

var server = tcp.createServer({
  target: {
    host: '127.0.0.1',
    port: 8080
  }
});

server.listen(8081);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = express.Router();

// TODO: remove row2 in SELECT of queries?

router.use(function(req, res, next) {
  // gen new value and insert
  // let y;
  // y = Math.trunc(Math.random() * 20);
  // pool.query(`INSERT INTO data(x, y) SELECT max(x) + 1, ${y} FROM data;`, (err, res) => { console.log(err, res) });
  
  const query = `
    SELECT  * 
    FROM (SELECT total_active_power as y, row2, date as x
    FROM sensorreadings
    WHERE row2 = ${pool.escape(req.query.panel)}
    ORDER BY date DESC
    LIMIT 280) AS a
    ORDER BY x ASC
  `;
  pool.query(query, (err, result) => {
    if (err) console.log(err);
    console.log(result);
      res.send(result);
  })
    console.log('Something is happening.');
});


app.get('/', function (req, res, next) {
  const query = `
      SELECT  * 
      FROM (SELECT total_active_power as y, row2, date as x
      FROM sensorreadings
      WHERE row2 = ${pool.escape(req.query.panel)}
      ORDER BY date DESC
      LIMIT 280) AS a
      ORDER BY x ASC
    `;
    pool.query(query, (err, result) => {
      if (err) console.log(err);
      console.log(result);
        res.send(result);
    })
      console.log('Something is happening.');
});

app.get('/voltage', function (req, res, next) {
  const query = `
    SELECT  * 
    FROM (SELECT r_phase_voltage as r, y_phase_voltage as y, b_phase_voltage as b, row2, date as x
    FROM sensorreadings
    WHERE row2 = ${pool.escape(req.query.panel)}
    ORDER BY date DESC
    LIMIT 280) AS a
    ORDER BY x ASC
  `;
  pool.query(query, (err, result) => {
    if (err) console.log(err);
    console.log(result);
      res.send(result);
  })
    console.log('Something is happening.');
});

app.get('/current', function (req, res, next) {
  const query = `
    SELECT  * 
    FROM (SELECT r_phase_current as r, y_phase_current as y, b_phase_current as b, row2, date as x
    FROM sensorreadings
    WHERE row2 = ${pool.escape(req.query.panel)}
    ORDER BY date DESC
    LIMIT 280) AS a
    ORDER BY x ASC
  `;
  pool.query(query, (err, result) => {
    if (err) console.log(err);
    console.log(result);
      res.send(result);
  })
    console.log('Something is happening.');
});

app.get('/power', function (req, res, next) {
  const query = `
    SELECT  * 
    FROM (SELECT r_phase_active_power as r, y_phase_active_power as y, b_phase_active_power as b, row2, date as x
    FROM sensorreadings
    WHERE row2 = ${pool.escape(req.query.panel)}
    ORDER BY date DESC
    LIMIT 280) AS a
    ORDER BY x ASC
  `;
  pool.query(query, (err, result) => {
    if (err) console.log(err);
    console.log(result);
      res.send(result);
  })
    console.log('Something is happening.');
});

app.get('/pf', function (req, res, next) {
  const query = `
    SELECT  * 
    FROM (SELECT total_power_factor as y, row2, date as x
    FROM sensorreadings
    WHERE row2 = ${pool.escape(req.query.panel)}
    ORDER BY date DESC
    LIMIT 280) AS a
    ORDER BY x ASC
  `;
  pool.query(query, (err, result) => {
    if (err) console.log(err);
    console.log(result);
      res.send(result);
  })
    console.log('Something is happening.');
});

app.get('/ce', function (req, res, next) {
  const query = `
    SELECT  * 
    FROM (SELECT cumulative_energy_KWh as y, row2, date as x
    FROM sensorreadings
    WHERE row2 = ${pool.escape(req.query.panel)}
    ORDER BY date DESC
    LIMIT 280) AS a
    ORDER BY x ASC
  `;
  pool.query(query, (err, result) => {
    if (err) console.log(err);
    console.log(result);
      res.send(result);
  })
    console.log('Something is happening.');
});

app.listen(port);
console.log('Magic happens on port ' + port);
