
const socketIo = require('socket.io');
const app = require('./app');
const sessionMiddleware = require('./config/session.config');
const { OneDrive } = require('./app/services/onedrive');
const io = socketIo(app);


// Assuming sessionMiddleware is adapted to work with Promises
io.use(async (socket, next) => {
    try {
        // Attempt to load the session
        await new Promise((resolve, reject) => {
            sessionMiddleware(socket.request, {}, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        // Check if the session has a user property
        if (!socket.request.session ||!socket.request.session.user) {
            // Authentication failed because the session does not contain a user
            return next(new Error('Authentication failed: No user found in session.'));
        }

        // Attach the session data to the socket object
        socket.session = socket.request.session;

        // Proceed with the connection
        next();
    } catch (err) {
        // Pass the error to the next middleware
        next(err);
    }
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

    socket['permission'] = setInterval(checkPermissions, 5000); // Poll every 5 seconds
}

io.on('connection', (socket) => {
    // console.log('A user connected');

    if (socket.session && socket.session.user) {
        console.log("User '%s' connected", socket.session?.user?.info?.displayName?? 'N/A');
    }

    socket.on('watchFile', (fileId) => {
        // console.log(`Watching file: ${fileId}`);
        pollPermissions(fileId, socket);
    });

    socket.on('disconnect', () => {
        console.log("User '%s' disconnected", socket.session?.user?.info?.displayName?? 'N/A');
        if(socket['permission']) clearInterval(socket['permission']);
    });
});
