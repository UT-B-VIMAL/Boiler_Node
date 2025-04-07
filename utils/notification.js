let io;

const initializeSocket = (server) => {
    io = require('socket.io')(server, {
        cors: {
            origin: "*", // Allow all origins (adjust as needed)
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};

const sendNotification = (event, data) => {
    if (!io) {
        console.error("Socket.io is not initialized. Call initializeSocket first.");
        return;
    }
    io.emit(event, data); 
};

module.exports = {
    initializeSocket,
    sendNotification,
};
