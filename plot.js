// TODO: take host from config
var socket = io.connect('http://localhost');

var metrics = {};
var layout = {displayModeBar: true, scrollZoom: true};
Plotly.newPlot('plotdiv', metrics, null, layout);

socket.on('refresh', (metrics) => {
  plotdiv.data = metrics;
  Plotly.redraw('plotdiv');
  // TODO: use more efficient update
  //        redraw breaks graph view state (zoom, pan, ...)
});

//socket.emit(...)
