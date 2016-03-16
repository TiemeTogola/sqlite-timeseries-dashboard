var sql = require('sql.js'),
    fs = require('fs');

var refreshInterval = 3000;
var db = new sql.Database(fs.readFileSync('../test.sqlite'));
// ignore invalid data, just small notification
// try to handle various database schema, take user input to help
// TODO: take care of different column names
//var tableInfo = 'PRAGMA table_info(' + tables[i] + ')';

// retrieve table names
var tables = [];
var tablesQuery = 'SELECT tbl_name FROM sqlite_master WHERE type="table"';
db.each(tablesQuery, {}, (row) => {
  tables.push(row.tbl_name);
});

// 
// use join instead?
function buildUnionQuery(column, tables, whereCond) {
  var query = 'SELECT ' + column + ' FROM ';
  tables.forEach((table, index) => {
    if (index == tables.length-1)
      query +=  (whereCond === undefined) ? table + ';'
                                          : table + ' WHERE ' + whereCond + ';';
    else query += table + ' UNION ' + query;
  });
  return query;
}

var metrics = [];
var namesQuery = buildUnionQuery('DISTINCT name', tables);

db.each(namesQuery, {}, (metric) => {
  // plotly format: {name:name, type:type, x:timestamps, y:values}
  //console.log(metric);

  var timestampQuery = buildUnionQuery('timestamp', tables, 'name='+metric.name);
  metric.x = db.exec(timestampQuery);
  console.log(metric.x[0]);
  //var valuesQuery = buildUnionQuery('value', tables);
  //metric.y = db.exec(valuesQuery);
  //metric.type = 'scatter';
  //metrics.push(metric);
});
//console.log(metrics);

//var layout = {displayModeBar: true, scrollZoom: true};
//plotly.newplot('plotdiv', metrics, null, layout);

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
