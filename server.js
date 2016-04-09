// TODO: take care of different column names, SELECT ... AS to convert
// sqlite file path as argument, port as arg, ...
//var tableInfo = 'PRAGMA table_info(' + tables[i] + ')';
// ignore invalid data, just small notification
// try to handle various database schema, regex, take user input to help
// triggers?

var sql = require('sql.js'),
    fs = require('fs'),
    app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io')(server);

var refreshInterval = 5000; // milliseconds
server.listen('8000');
console.log('server listening on port ' + server.address().port);

// routing
app.get('/',(req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.get('/plot.js',(req, res) => {
    res.sendFile(__dirname + '/plot.js');
});

io.on('connect', (socket) => {
    socket.emit('init', collectData());
    setInterval(() => {
        socket.emit('refresh', collectData());
    }, refreshInterval);
    //socket.on(...)
});
// handle errors, disconnection, other events...

/*
 * plotly format:
 *
 * metrics = [
 *  { name: name,
 *    x: timestamps,
 *    y: values,
 *    type: type },
 *              ...];
 */
function collectData() {
    var db = new sql.Database(fs.readFileSync('../test.sqlite'));

    // retrieve table names
    var tables = [];
    var tablesQuery = 'SELECT tbl_name FROM sqlite_master WHERE type="table"';
    db.each(tablesQuery, {}, (row) => {
        tables.push(row.tbl_name);
    });

    var metrics = [];
    if (tables.length == 0) return metrics;

    var namesQuery = buildUnionQuery('DISTINCT name', tables);

    db.each(namesQuery, {}, (metric) => {
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

    db.close();
    return metrics;
}

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
