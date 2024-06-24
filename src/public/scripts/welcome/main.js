import { getUserDetails, getFileList } from '/scripts/welcome/api.js';
import Store from '/scripts/welcome/store.js';
import { 
    updateUserInfo, 
    updateFileList, 
    renderTree, 
    toggleButton, 
    toggleLoader 
} from '/scripts/welcome/ui.js';

import { watchFiles } from '/scripts/welcome/socket.js';

const init = async () => {
    const userInfo = await getUserDetails();
    if (userInfo.success) {
        updateUserInfo(userInfo);
    }

    const fileList = await getFileList();
    if (fileList.success) {
        updateFileList(fileList.data);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    init();

    document.getElementById('list-files').onclick = async function() {
        if (Store.listBtnClicked) return;

        Store.listBtnClicked = true;
        toggleButton('list-files');

        renderTree(document.getElementById('tree-container'), Store.treeList);
        watchFiles();
    };
});
