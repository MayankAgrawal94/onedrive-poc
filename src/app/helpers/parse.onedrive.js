const { formatBytes } = require("./genericFun");

const parseItemList = (rawPayload) => {
    return new Promise((resolve, reject) => {
        try {
            // Initialize an empty array to hold the simplified items
            let simplifiedItems = {};

            let sharedItemIds = [], childExistsIds = [];

            // Assuming rawPayload is an object containing a key "value" which is an array of items
            const items = rawPayload || [];

            items.forEach(item => {
                let simplifiedItem = {};

                // Determine the type based on whether it's a file or a folder
                simplifiedItem.type = item.folder? 'folder' : 'file';

                // simplifiedItem.id = item.id;

                simplifiedItem.name = item.name;
                // simplifiedItem.size = item.size;                // in bytes
                simplifiedItem.size = formatBytes(item.size)       // size formated

                // Extract and transform the creator information
                // simplifiedItem.createdByApplication = item.createdBy.application.displayName;
                // simplifiedItem.createdById = item.createdBy.application.id;
                simplifiedItem.createdByUsername = item.createdBy?.user?.displayName?? null;
                simplifiedItem.createdByIdentity = item.createdBy?.user?.id?? null;

                // Include child count for folders
                if (simplifiedItem.type === 'folder') {
                    simplifiedItem.child = {
                        count: item.folder?.childCount?? 0,
                        value: []
                    }
                    childExistsIds.push(item.id)
                } else {
                    simplifiedItem.file = { mimeType: item.file?.mimeType?? null }
                }

                // Include sharing information if present
                if (item.shared) {
                    simplifiedItem.shared = {
                        // sharedScope: item.shared.scope,
                        sharedDateTime: item.shared.sharedDateTime || null, // key 'sharedDateTime' not avaiable in responses
                        value: []
                    }
                    sharedItemIds.push(item.id)
                }

                simplifiedItem.downloadUrl = item["@microsoft.graph.downloadUrl"] || null

                // Extract and transform the creation date-time
                simplifiedItem.createdAt = item.createdDateTime;
                simplifiedItem.updatedAt = item.lastModifiedDateTime;

                // Add the simplified item to the list
                simplifiedItems[item.id] = simplifiedItem;
            });
            // console.log( "sharedItemIds =>>", sharedItemIds )
            // console.log( "childExistsIds =>>", childExistsIds )

            resolve({
                sharedItemIds,
                childExistsIds,
                parseValues: simplifiedItems
            }); // Resolve the promise with the processed items
        } catch (error) {
            reject(error); // Reject the promise if an error occurs
        }
    })
}

const parsePermission = (rawPayload) => {
    return new Promise((resolve, reject) => {
        try {
            // Initialize an empty array to hold the simplified items
            let simplifiedItems = [];

            // Assuming rawPayload is an object containing a key "value" which is an array of items
            const items = rawPayload || [];
            items.forEach(item => {
                let simplifiedItem = {roles: [], users: []};

                simplifiedItem.roles = item.roles
                // simplifiedItem.userDisplayName = item.grantedTo?.user?.displayName?? null;
                // simplifiedItem.email = item.grantedTo?.user?.email?? null;

                if ( Array.isArray(item.grantedToIdentities) 
                        && item.grantedToIdentities.length > 0) {

                    item.grantedToIdentities.forEach(obj => {
                        simplifiedItem.users.push({
                            displayName: obj?.user?.displayName?? null,
                            email: obj?.user?.email?? null
                        })
                    })
                } else if ( item.grantedTo ) {
                    simplifiedItem.users.push({
                        displayName: item.grantedTo?.user?.displayName?? null,
                        email: item.grantedTo?.user?.email?? null
                    })
                }
                

                if(Array.isArray(simplifiedItem.users) 
                        && simplifiedItem.users.length > 0){

                    simplifiedItems.push(simplifiedItem)
                }
                    
            })

            resolve(simplifiedItems)
        } catch (err) {
            reject(err)
        }
    })
}

module.exports = {
    parseItemList,
    parsePermission
}
// console.log(JSON.stringify(parsedResponse, null, 2));
