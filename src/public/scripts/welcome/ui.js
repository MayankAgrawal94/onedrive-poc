import Store from '/scripts/welcome/store.js';

export const updateUserInfo = (userInfo) => {
    const titleSpan = document.getElementById('username');
    titleSpan.innerHTML = userInfo.data.displayName;
    Store.userInfo = userInfo.data;
}

export const updateFileList = (fileList) => {
    Store.treeList = fileList;
    toggleButton('list-files');
    toggleLoader('btn-list-loader-01');
}

export const toggleButton = (id) => {
    const listFilesButton = document.getElementById(id);
    listFilesButton.disabled = !listFilesButton.disabled;
}

export const toggleLoader = (id) => {
    const loaderElement = document.getElementById(id);
    if (!loaderElement) {
        console.error(`Element with ID "${id}" not found`);
        return;
    }
    const displayStyle = window.getComputedStyle(loaderElement).display;
    
    loaderElement.style.display = 'inline-block'.includes(displayStyle) ? 'none' : 'inline-block';
}

export const renderTree = (parentContainer, items = {}) => {
    for (let [key, item] of Object.entries(items)) {
        Store.fileList.push(key);
        const div = document.createElement('div');
        div.classList.add('tree-item');

        if (item.type === 'folder') {
            let innerHTML = `<span class="folder-icon"></span><span>${item.name}</span>`;
            let userList = '';
            if (item.shared && Array.isArray(item.shared.value)) {
                const sharedName = getSharedName(item.shared.value);
                userList = `${sharedName ? `(${sharedName})` : ''}`;
            }
            innerHTML += `<span class="shared-list" id="${key}"> ${userList} </span>`;
            div.innerHTML = innerHTML;
            const folderDiv = document.createElement('div');
            folderDiv.classList.add('tree-folder');
            folderDiv.appendChild(div);
            parentContainer.appendChild(folderDiv);

            const folderChildrenContainer = document.createElement('div');
            folderChildrenContainer.classList.add('folder-children');
            folderDiv.appendChild(folderChildrenContainer);

            renderTree(folderChildrenContainer, item.child.value);
        } else {
            let innerHTML = `<span class="file-icon"></span><span>${item.name}</span>`;
            let userList = '';
            if (item.shared && Array.isArray(item.shared.value)) {
                const sharedName = getSharedName(item.shared.value);
                userList = `${sharedName ? `(${sharedName})` : ''}`;
            }
            innerHTML += `<span class="shared-list" id="${key}"> ${userList} </span>`;
            div.innerHTML = innerHTML;
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

export const getSharedName = (sharedValues) => {
    let displayNames = sharedValues.map(obj => obj.userDisplayName).filter(name => name != null);
    displayNames = [...new Set(displayNames)];
    return displayNames.join(', ');
}

export const onDownloadFile = (fileName, downloadUrl) => {
    const anchor = document.createElement('a');
    anchor.href = downloadUrl;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
}

export const updatePermissions = (permissions) => {
    permissions.map((item) => {
        const spanElement = document.getElementById(item.data.parentId);
        if (item.success && item.data && Array.isArray(item.data.value) && item.data.value.length > 0) {
            const sharedName = getSharedName(item.data.value);
            spanElement.textContent = `${sharedName ? `(${sharedName})` : ''}`;
        } else {
            spanElement.textContent = '';
        }
    })
}
