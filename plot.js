var sql = require('sql.js'),
    fs = require('fs');

var refreshInterval = 3000;
var db = new sql.Database(fs.readFileSync('../test.sqlite'));
// TODO: take care of different column names, SELECT ... AS to convert
//var tableInfo = 'PRAGMA table_info(' + tables[i] + ')';
// ignore invalid data, just small notification
// try to handle various database schema, take user input to help

// retrieve table names
var tables = [];
var tablesQuery = 'SELECT tbl_name FROM sqlite_master WHERE type="table"';
db.each(tablesQuery, {}, (row) => {
  tables.push(row.tbl_name);
});

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

var layout = {displayModeBar: true, scrollZoom: true};
Plotly.newPlot('plotdiv', metrics, null, layout);

//setInterval(() => {
  //var d = plotdiv.data;
  //var len = d[0].x.length;
  //d[0].x.push(d[0].x[len-1]+1);
  //d[0].y.push(d[0].y[len-1]+1);
  //d[0].type = 'scatter';
  //plotdiv.data = d;
  //Plotly.redraw('plotdiv'); // use more efficient update
//}, refreshInterval);
// triggers?
