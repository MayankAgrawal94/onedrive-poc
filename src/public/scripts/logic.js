
/* Socket IO **/
const socket = io();

const ApiV1 = '/v1'

const Store = {
    treeList: null,
    userInfo: null,
    fileList: [],
    listBtnClicked: false
}

const getUserDetails = async() => {
    const userResp = await fetch(`${ApiV1}/basic/user/self`);
    const userInfo = await userResp.json();
    if (userInfo.success) {
        const titleSpan = document.getElementById('username');
        titleSpan.innerHTML = userInfo.data.displayName
        Store.userInfo = userInfo.data
    }
}

const getFileList = async() => {
    const resp = await fetch(`${ApiV1}/ms/onedrive/files/list`);
    const response = await resp.json();
    if (response.success) {
        // console.log( response.data )
        Store.treeList = response.data
        toggleButton('list-files')
    }
}

const init = async() => {
    getUserDetails()
    getFileList()
}

init();

const toggleButton = (id) => {
    const listFilesButton = document.getElementById(id);
    listFilesButton.disabled = listFilesButton.disabled ? false : true;
}

const onDownloadFile = (fileName, downloadUrl) => {
    // Create an anchor element
    const anchor = document.createElement('a');
    anchor.href = downloadUrl;
    anchor.download = fileName;

    // Append the anchor to the body (required for Firefox)
    document.body.appendChild(anchor);

    // Trigger a click event on the anchor
    anchor.click();

    // Remove the anchor from the body
    document.body.removeChild(anchor);
}

const getSharedName = (sharedValues) => {
    let displayNames = sharedValues.map(obj => obj.userDisplayName)
                            .filter(name => name != null);
    displayNames = [...new Set(displayNames)]               
    return displayNames.join(', ');
}

const updatePermissions = (permissions) => {
    permissions.map((item, i) => {
        // Select the span element by its ID
        let spanElement = document.getElementById(item.data.parentId);
        if( item.success 
            && item.data 
                && Array.isArray(item.data.value) 
                    && item.data.value.length > 0 ) {

            // Change the text content
            const sharedName = getSharedName(item.data.value)
            spanElement.textContent = `${sharedName ? `(${sharedName})` : ''}`
        } else {
            spanElement.textContent = ''
        }
        
    })
}

// On Click on button 'List Files'
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('list-files').onclick = async function() {

        if(Store.listBtnClicked) return;
        
        Store.listBtnClicked = true
        toggleButton('list-files')

        function renderTree(parentContainer, items = {}) {
            for(let [key, item] of Object.entries(items)) {

                Store.fileList.push(key)
                const div = document.createElement('div');
                div.classList.add('tree-item');
            
                if (item.type === 'folder') {
                    let innerHTML = '<span class="folder-icon"></span><span>' + item.name + '</span>'
                    let userList = ''
                    if( item.shared && Array.isArray(item.shared.value) ) {
                        const sharedName = getSharedName(item.shared.value)
                        userList = `${sharedName ? `(${sharedName})` : ''}`
                    }
                    innerHTML += `<span class="shared-list" id="${key}"> ${userList} </span>`
                    div.innerHTML = innerHTML
                    // div.title = 'Nested folder - Work in Progress (Not Covered in Proof of Concept)'; 
                    const folderDiv = document.createElement('div');
                    folderDiv.classList.add('tree-folder');
                    folderDiv.appendChild(div);
                    parentContainer.appendChild(folderDiv);
            
                    // Create a new container for this folder's children
                    const folderChildrenContainer = document.createElement('div');
                    folderChildrenContainer.classList.add('folder-children');
                    folderDiv.appendChild(folderChildrenContainer);
            
                    // Recursively render this folder's children
                    renderTree(folderChildrenContainer, item.child.value);
                } else {
                    let innerHTML = '<span class="file-icon"></span><span>' + item.name + '</span>';
                    let userList = ''
                    if( item.shared && Array.isArray(item.shared.value) ) {
                        const sharedName = getSharedName(item.shared.value)
                        userList = `${sharedName ? `(${sharedName})` : ''}`
                    }
                    innerHTML += `<span class="shared-list" id="${key}"> ${userList} </span>`
                    div.innerHTML = innerHTML
                    if (item.downloadUrl) {
                        const downloadSpan = document.createElement('span');
                        downloadSpan.classList.add('download-icon');
                        downloadSpan.onclick = () => onDownloadFile(item.name, item.downloadUrl);
                        downloadSpan.title = 'Download';
                        div.appendChild(downloadSpan);
                    }
                    parentContainer.appendChild(div);
                }
            }
        }
        
        // Start rendering at the root level
        renderTree(document.getElementById('tree-container'), Store.treeList);
        socket.emit('watchFile', Store.fileList);
    };
})

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('permissionsUpdated', (permissions) => {
    if( Array.isArray(permissions) && permissions.length > 0 ) updatePermissions(permissions)
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});