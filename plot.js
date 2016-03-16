var sql = require('sql.js'),
    fs = require('fs');

var refreshInterval = 3000;
var db = new sql.Database(fs.readFileSync('../test.sqlite'));
// ignore invalid data, just small notification
// try to handle various database schema, take user input to help

var tables = [];
var tablesQuery = 'SELECT tbl_name FROM sqlite_master WHERE type="table"';
db.each(tablesQuery, {}, (row) => {
  tables.push(row.tbl_name);
});

var metrics = [];
var metricsQuery = 'select distinct name from $table';
tables.forEach((table) => {
  db.each(metricsQuery, {$table:table}, (metric) => {
    // add distinct to metrics
  });
  //metrics.append
}
console.log(tables);
//console.log(db.exec(tablesQuery)[0].values);
// find distinct metric names
// db.each
//console.log(db.exec('select distinct value from gauges')[0].values[0][0]);

//var tableInfo = 'PRAGMA table_info(' + tables[i] + ')';
//var allMetrics = db.exec(query)[0];
//console.log(allMetrics);
//console.log(db.exec()[0]);
//for (var metric in metrics) {
  //// more efficient query..
  //db.exec('SELECT * FROM Gauges')[0].values.forEach((row) => {
    //gauges.timestamps.push(row[0]);
    //gauges.values.push(row[2]);
  //});
//}

//var data = [
  //{x: gauges.timestamps,
  //y: gauges.values,
  //type: 'scatter',
  //name: 'gauges'}];

//var layout = {displayModeBar: true, scrollZoom: true};
//plotly.newplot('plotdiv', data, null, layout);

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
