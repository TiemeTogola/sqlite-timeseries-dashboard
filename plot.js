var sql = require('sql.js'),
    fs = require('fs');

var refreshInterval = 3000;
//var dbFile = '../test.sqlite';

var db = new sql.Database(fs.readFileSync('../test.sqlite'));
// schemas
// CREATE TABLE Gauges (timestamp varchar?text?int, name text, value real);
// CREATE TABLE Sets ...
// TODO: allow to work with any schema?

var gauges = { timestamps: [], values: [] };

// more efficient query..
db.exec('SELECT * FROM Gauges')[0].values.forEach((row) => {
  gauges.timestamps.push(row[0]);
  gauges.values.push(row[2]);
});

var data = [ { x: gauges.timestamps, y: gauges.values, type: 'scatter'} ];

console.log(data)
Plotly.newPlot('plotdiv', data, null, {displayModeBar: true, scrollZoom: true});

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

var structure = [
  {
    x: [1, 3, 6], // trace1
    y: [1, 3, 6],
    type: 'scatter'
  },
  {
    x: [3, 9, 27], // trace2
    y: [3, 9, 27],
    type: 'scatter'
  }
  // ...
];
