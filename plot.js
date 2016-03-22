// TODO: take host from config
//       more efficient plot update
var socket = io();

socket.on('init', (metrics) => {
    var layout = {displayModeBar: true, scrollZoom: true};
    Plotly.newPlot('plotdiv', metrics, null, layout);
});

socket.on('refresh', (metrics) => {
    plotdiv.data = metrics;
    Plotly.redraw('plotdiv');
});

//socket.emit(...)
