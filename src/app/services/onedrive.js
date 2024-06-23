const { default: axios } = require("axios");
const { MsOAuth2Config } = require("../../config/env");
const { parseItemList, parsePermission } = require("../helpers/onedrive");

const listAllItemInDrive = async (accessToken) => {
    try {
        const { data } = await axios.get(`${MsOAuth2Config.msGraphEndpoint}/me/drive/root/children`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return {
            success: true, 
            message: 'Request Executed.', 
            data: await parseItemList(data.value)
        };
    } catch (error) {
        console.error('ERROR - listAllItemInDrive', error.response ? error.response.data : error.message);
        return { 
            success: false, 
            message: 'Error fetching files'
        }
    }
}

const getFilePermissions = async (accessToken, id) => {
    try {
        const { data } = await axios
        .get(`${MsOAuth2Config.msGraphEndpoint}/me/drive/items/${id}/permissions`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return {
            success: true, 
            message: 'Request Executed.', 
            data: await parsePermission(data.value)
        };
    } catch (error) {
        console.error('ERROR - getFilePermissions', error.response ? error.response.data : error.message);
        return { 
            success: false, 
            message: 'Error fetching files permissions'
        }
    }
}

module.exports = {
    listAllItemInDrive,
    getFilePermissions
}
