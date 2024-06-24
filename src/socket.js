
const socketIo = require('socket.io');
const app = require('./app');
const sessionMiddleware = require('./config/session.config');
const { getFilePermissions } = require('./app/services/onedrive');
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
    const accessToken = socket.session.user.auth.access_token

    const checkPermissions = async () => {
        try {
            // Map over the array of IDs to create an array of promises
            // const permissionRequests = fileIds.map(id => 
            //     getFilePermissions(accessToken, id));
            // const currentPermissions = await Promise.all(permissionRequests);

            fileIds.map(async (id, i) => {
                const result = await getFilePermissions(accessToken, id);
                socket.emit('permissionsUpdated', [result]);
            })

        } catch (err) {
            console.error('Error polling permissions:', error.message);
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
