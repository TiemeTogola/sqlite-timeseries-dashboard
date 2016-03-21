var sql = require('sql.js'),
    fs = require('fs'),
    app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io')(server);

var refreshInterval = 5000;
var db = new sql.Database(fs.readFileSync('../test.sqlite'));
// TODO: take care of different column names, SELECT ... AS to convert
//var tableInfo = 'PRAGMA table_info(' + tables[i] + ')';
// ignore invalid data, just small notification
// try to handle various database schema, take user input to help
// triggers?

server.listen('8000');

app.get('/',(req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  setInterval(() => {
    socket.emit('refresh', collectData());
    console.log('refreshing...');
  }, refreshInterval);
  //socket.on(...)
});
// handle errors, disconnection, other events...

function buildUnionQuery(column, tables, whereCond) {
  var query = 'SELECT ' + column + ' FROM ';
  var whereStr = (whereCond === undefined) ? '' : ' WHERE ' + whereCond;
  tables.forEach((table, index) => {
    if (index == tables.length-1)
      query += table + whereStr + ';';
    else query += table + whereStr + ' UNION ' + query;
  });
  return query;
}

function collectData() {
  // retrieve table names
  var tables = [];
  var tablesQuery = 'SELECT tbl_name FROM sqlite_master WHERE type="table"';
  db.each(tablesQuery, {}, (row) => {
    tables.push(row.tbl_name);
  });

  var metrics = [];
  var namesQuery = buildUnionQuery('DISTINCT name', tables);

  db.each(namesQuery, {}, (metric) => {
    // plotly format: metric = {name:name, x:timestamps, y:values, type:type}
    var dataQuery = buildUnionQuery('timestamp, value', tables,
                                    'name="' + metric.name + '"');
    var data = db.exec(dataQuery)[0].values;
    metric.x = []; metric.y = [];
    data.forEach((element) => {
      metric.x.push(element[0]);
      metric.y.push(element[1]);
    });
    metric.type = 'scatter';
    metrics.push(metric);
  });

  console.log(metrics);
  return metrics;
}
