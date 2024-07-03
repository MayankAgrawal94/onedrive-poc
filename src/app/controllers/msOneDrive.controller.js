const { OneDrive } = require("../services/onedrive");
const { 
    fetchAndSetPermissions, 
    fetchAndSetChildrenRecursive 
} = require("../helpers/files.ondrive");

/* 
    To handle an arbitrary number of nested layers with children and permissions
    in a more modular and recursive manner, you need to implement a recursive function. 
    This function should handle both fetching child items and their permissions.

    Here's how you can approach this:
    Step-by-Step Approach
        1. Recursive Function for Children: Implement a recursive function to fetch child
         items and their permissions.
        1. Fetch and Set Permissions: Modularize the permission fetching logic.
        3. Combine Both in Main Function: Combine the logic in the main function to handle 
         the overall process.
**/
const getMsOneDriveFiles = async (req, res) => {
    try {
        const oneDriveService = new OneDrive(req.session)
        const result = await oneDriveService.listAllItemInDrive(req.msAccessToken);

        if (result && result.success) {
            const { sharedItemIds, childExistsIds, parseValues } = result.data;

            if (Array.isArray(sharedItemIds) && sharedItemIds.length > 0) {
                await fetchAndSetPermissions(oneDriveService, sharedItemIds, parseValues);
            }

            if (Array.isArray(childExistsIds) && childExistsIds.length > 0) {
                await fetchAndSetChildrenRecursive(oneDriveService, childExistsIds, parseValues);
            }

            return res.send({
                success: true,
                message: 'Request Executed!',
                data: parseValues,
            });
        }

        return res.send({
            success: false,
            message: 'Something went wrong!',
        });
    } catch (error) {
        console.error('ERROR: /list-files =>', error.response ? error.response.data : error.message);
        res.status(500).send('Error fetching files');
    }
}
/**
 * Explanation
    1. Main Controller Function: getMsOneDriveFiles orchestrates the process, starting by 
     fetching the initial items.
    2. Fetch and Set Permissions: fetchAndSetPermissions is a helper function that fetches and 
     sets permissions for a given list of item IDs.
    3. Recursive Function for Children: fetchAndSetChildrenRecursive is a recursive function that:
        - Fetches child items.
        - Sets child values in the parseValues object.
        - Recursively calls itself for further nested children.
        - Fetches and sets permissions for both current and nested children.
        
   Benefits
    - Scalability: Handles any number of nested layers efficiently.
    - Modularity: Clear separation of concerns, with each function handling a specific task.
    - Readability: Improved readability by breaking down the logic into smaller, reusable functions.

  This approach ensures that your code can handle deeply nested structures and fetch all necessary permissions at each level. 
*/

module.exports = {
    getMsOneDriveFiles
}