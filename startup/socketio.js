const socketio = require('socket.io');

module.exports = function initSocketIO(server) {
  const websocket = socketio(server);
  websocket.on('connection', socket => {
    // For testing
    setInterval(() => {
      socket.emit('message', 'yoyoyoyoyo');
    }, 10000);
    websocket.on('disconnect', () => console.log('Client disconnected'));
    websocket.on('message', message => console.log(message));
  });
};
