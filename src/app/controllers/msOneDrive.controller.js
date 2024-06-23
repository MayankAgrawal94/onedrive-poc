const { listAllItemInDrive, getFilePermissions } = require("../services/onedrive");

const getMsOneDriveFiles = async (req, res) => {    
    try {
        const result = await listAllItemInDrive(req.msAccessToken)

        if( result && result.success ) {
            const { sharedItemIds, childExistsIds, parseValues } = result.data
            // childExistsIds // TODO - Not required for this POC
            if( Array.isArray(sharedItemIds) 
                && sharedItemIds.length > 0 ) {

                // Map over the array of IDs to create an array of promises
                const permissionRequests = sharedItemIds.map(id => 
                    getFilePermissions(req.msAccessToken, id));
                const permissions = await Promise.all(permissionRequests);
                permissions.map((item,i) => {
                    if(item.success) {
                        parseValues[sharedItemIds[i]]['shared']['value'] = item.data
                    }
                })

                return res.send({
                    success: true,
                    message: 'Request Executed!',
                    data: parseValues
                })
            }
        }
        return res.send({
            success: false,
            message: 'Something went wrong!'
        })
    } catch (error) {
        console.error('ERROR: /list-files =>', error.response ? error.response.data : error.message);
        res.status(500).send('Error fetching files');
    }
}

module.exports = {
    getMsOneDriveFiles
}