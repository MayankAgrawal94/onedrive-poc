const { 
    listAllItemInDrive, 
    getFilePermissions, 
    listChildrenItems 
} = require("../services/onedrive");

const getMsOneDriveFiles = async (req, res) => {
    try {
        const result = await listAllItemInDrive(req.msAccessToken);

        if (result && result.success) {
            const { sharedItemIds, childExistsIds, parseValues } = result.data;

            if (Array.isArray(sharedItemIds) && sharedItemIds.length > 0) {
                await fetchAndSetPermissions(req.msAccessToken, sharedItemIds, parseValues);

                if (Array.isArray(childExistsIds) && childExistsIds.length > 0) {
                    await fetchAndSetChildren(req.msAccessToken, childExistsIds, parseValues);
                }

                return res.send({
                    success: true,
                    message: 'Request Executed!',
                    data: parseValues,
                });
            }
        }

        return res.send({
            success: false,
            message: 'Something went wrong!',
        });
    } catch (error) {
        console.error('ERROR: /list-files =>', error.response ? error.response.data : error.message);
        res.status(500).send('Error fetching files');
    }
};

const fetchAndSetPermissions = async (token, itemIds, parseValues) => {
    const permissionRequests = itemIds.map(id => getFilePermissions(token, id));
    const permissions = await Promise.all(permissionRequests);

    permissions.forEach(item => {
        if (item.success) {
            parseValues[item.data.parentId]['shared']['value'] = item.data.value;
        }
    });
};

const fetchAndSetChildren = async (token, itemIds, parseValues) => {
    const childrenListRequests = itemIds.map(id => listChildrenItems(token, id));
    const childrenListResults = await Promise.all(childrenListRequests);

    for (const item of childrenListResults) {
        if (item.success && item.data && item.data.value && item.data.value.parseValues && Object.keys(item.data.value.parseValues).length > 0) {
            const childValue = item.data.value;
            parseValues[item.data.parentId]['child']['value'] = childValue.parseValues;

            if (Array.isArray(childValue.sharedItemIds) && childValue.sharedItemIds.length > 0) {
                await fetchAndSetChildPermissions(token, childValue.sharedItemIds, parseValues[item.data.parentId]['child']['value']);
            }
        }
    }
};

const fetchAndSetChildPermissions = async (token, childItemIds, childParseValues) => {
    const childPermissionRequests = childItemIds.map(id => getFilePermissions(token, id));
    const childPermissions = await Promise.all(childPermissionRequests);

    childPermissions.forEach(childItem => {
        if (childItem.success) {
            childParseValues[childItem.data.parentId]['shared']['value'] = childItem.data.value;
        }
    });
};

module.exports = {
    getMsOneDriveFiles
}