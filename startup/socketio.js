const socketio = require('socket.io');

module.exports = function initSocketIO(server) {
  const websocket = socketio(server);
  websocket.on('connection', socket => {
    // For testing
    setInterval(() => {
      socket.emit('api', 'yoyoyoyoyo from api');
    }, 10000);
    socket.on('disconnect', () => console.log('Client disconnected'));
    socket.on('mobile', message => console.log(message));
  });
};
