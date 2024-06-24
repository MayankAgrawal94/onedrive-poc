import Store from '/scripts/welcome/store.js';
import { updatePermissions } from '/scripts/welcome/ui.js';

const socket = io();

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('permissionsUpdated', (permissions) => {
    if (Array.isArray(permissions) && permissions.length > 0) {
        updatePermissions(permissions);
    }
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

export const watchFiles = () => {
    socket.emit('watchFile', Store.fileList);
};
