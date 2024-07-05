const { default: axios } = require("axios");
const { MsOAuth2Config } = require("../../config/env");
const { parseItemList, parsePermission } = require("../helpers/parse.onedrive");
const { updateMsAccessToken } = require('../helpers/token.ondrive');

class OneDrive {
    session = null;
    maxRetries = 3; // Maximum number of retries

    constructor(session) {
        this.session = session
    }

    get accessToken() {
        return this.session?.user?.auth?.access_token ?? '';
    }

    get refreshToken() {
        return this.session?.user?.auth?.refresh_token ?? '';
    }

    async makeApiRequest(url, parseFunction, retryCount = 0) {
        try {
            const { data } = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${this.accessToken}`
                }
            });
            return {
                success: true,
                message: 'Request executed successfully',
                data: await parseFunction(data.value)
            };
        } catch (error) {
            return this.handleError(error, () => this.makeApiRequest(url, parseFunction, retryCount + 1), retryCount);
        }
    }

    listAllItemInDrive = async () => {
        const url = `${MsOAuth2Config.msGraphEndpoint}/me/drive/root/children`;
        return this.makeApiRequest(url, parseItemList);
    }

    getFilePermissions = async (id) => {
        const url = `${MsOAuth2Config.msGraphEndpoint}/me/drive/items/${id}/permissions`;
        return this.makeApiRequest(url, async (value) => {
            return {
                parentId: id,
                value: await parsePermission(value)
            };
        });
    }

    listChildrenItems = async (id) => {
        const url = `${MsOAuth2Config.msGraphEndpoint}/me/drive/items/${id}/children`;
        return this.makeApiRequest(url, async (value) => {
            return {
                parentId: id,
                value: await parseItemList(value)
            };
        });
    }

    getFilePermissionsInBatch = async (ids, retryCount = 1) => {
        try {
            const batchRequestBody = {
                requests: ids.map((id) => ({
                    id,
                    method: 'GET',
                    url: `/me/drive/items/${id}/permissions`
                }))
            };
    
            const { data } = await axios.post( `${MsOAuth2Config.msGraphEndpoint}/$batch`, 
                batchRequestBody,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.accessToken}`
                    }
            })
            
            const result = []
            
            if (Array.isArray(data.responses) && data.responses.length > 0) {
                // Use Promise.all with map to handle async operations in the loop
                await Promise.all(data.responses.map(async (elem) => {
                  if (elem.status === 200) {
                    const parsedValue = await parsePermission(elem.body.value);
                    result.push({
                        success: true,
                        data: {
                            parentId: elem.id,
                            value: parsedValue
                        }
                    });
                  }
                }));
            }

            return {
                success: true,
                message: 'Request executed successfully',
                data: result
            }
        } catch (error) {
            return this.handleError(error, () => this.getFilePermissionsInBatch(ids, retryCount + 1), retryCount);
        }
    }

    handleError(error, retryCallback, retryCount) {
        const msErrorCode = error?.response?.data?.error?.code ?? '';
        console.error(`ERROR - makeApiRequest ${msErrorCode ? `| ${msErrorCode} ` : ''}`
            +`| Session ID: ${this.session.id}`, error.response ? error.response.data : error.message);
    
        if (msErrorCode === 'InvalidAuthenticationToken' && retryCount < this.maxRetries) {
            const checkUpdate = updateMsAccessToken(this.session);
            if (checkUpdate && checkUpdate.success) {
                return retryCallback();
            }
        }
    
        return {
            success: false,
            message: 'Error executing request'
        };
    }
    
}

module.exports = {
    OneDrive
}
