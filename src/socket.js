
const socketIo = require('socket.io');
const app = require('./app');
const sessionMiddleware = require('./config/session.config');
const { OneDrive } = require('./app/services/onedrive');

const io = socketIo(app);

// Helper function to promisify the session middleware
const wrapMiddleware = (middleware) => (socket, next) => {
    middleware(socket.request, {}, next);
};

io.use(wrapMiddleware(sessionMiddleware));

// Middleware to check for session user
io.use((socket, next) => {
    if (!socket.request.session || !socket.request.session.user) {
        return next(new Error('Authentication failed: No user found in session.'));
    }
    socket.session = socket.request.session;
    next();
});

const pollPermissions = async(fileIds, socket) => {
    
    const onedriveService = new OneDrive(socket.session)

    const checkPermissions = async () => {
        try {
            const result = await onedriveService.getFilePermissionsInBatch(fileIds)
            if( result.success ) {
                socket.emit('permissionsUpdated', result.data );
            }
        } catch (err) {
            console.error(`Error polling permissions: ${err?.message?? 'N/A'}`, err);
        }
    }

    socket.permissionInterval = setInterval(checkPermissions, 5000); // Poll every 5 seconds
}

io.on('connection', (socket) => {
    console.log(`User '${socket.session.user.info.displayName ?? 'N/A'}' connected`);

    socket.on('watchFile', (fileId) => {
        // console.log(`Watching file: ${fileId}`);
        pollPermissions(fileId, socket);
    });

    socket.on('disconnect', () => {
        console.log(`User '${socket.session.user.info.displayName ?? 'N/A'}' disconnected`);
        if (socket.permissionInterval) clearInterval(socket.permissionInterval);
    });
});
