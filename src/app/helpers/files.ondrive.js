const { getFilePermissions, listChildrenItems } = require("../services/onedrive");

const fetchAndSetPermissions = async (token, itemIds, parseValues) => {
    const permissionRequests = itemIds.map(id => getFilePermissions(token, id));
    const permissions = await Promise.all(permissionRequests);

    permissions.forEach(item => {
        if (item.success) {
            parseValues[item.data.parentId]['shared']['value'] = item.data.value;
        }
    });
}

const fetchAndSetChildrenRecursive = async (token, itemIds, parseValues) => {
    const childrenListRequests = itemIds.map(id => listChildrenItems(token, id));
    const childrenListResults = await Promise.all(childrenListRequests);

    for (const item of childrenListResults) {
        if (item.success && item.data && item.data.value && item.data.value.parseValues && Object.keys(item.data.value.parseValues).length > 0) {
            const childValue = item.data.value;
            parseValues[item.data.parentId]['child']['value'] = childValue.parseValues;

            if (Array.isArray(childValue.sharedItemIds) && childValue.sharedItemIds.length > 0) {
                await fetchAndSetPermissions(token, childValue.sharedItemIds, parseValues[item.data.parentId]['child']['value']);
            }

            if (Array.isArray(childValue.childExistsIds) && childValue.childExistsIds.length > 0) {
                await fetchAndSetChildrenRecursive(token, childValue.childExistsIds, parseValues[item.data.parentId]['child']['value']);
            }
        }
    }
}

module.exports = {
    fetchAndSetPermissions,
    fetchAndSetChildrenRecursive
}