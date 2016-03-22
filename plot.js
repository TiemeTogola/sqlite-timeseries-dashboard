// TODO: take host from config
var socket = io();

var metrics = [{name:'',type:'',x:[],y:[]}];
var layout = {displayModeBar: true, scrollZoom: true};
Plotly.newPlot('plotdiv', metrics, null, layout);

socket.on('refresh', (metrics) => {
  plotdiv.data = metrics;
  Plotly.redraw('plotdiv');
  // TODO: use more efficient update
  //        redraw breaks graph view state (zoom, pan, ...)
});

//socket.emit(...)
