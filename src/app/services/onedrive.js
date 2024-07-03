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
                message: 'Request Executed.',
                data: await parseFunction(data.value)
            };
        } catch (error) {
            const msErrorCode = error?.response?.data?.error?.code ?? '';

            console.error(`ERROR - makeApiRequest ${msErrorCode ? `| ${msErrorCode} ` : ''}`
                + `| ${this.session.id}`, error.response ? error.response.data : error.message);

            if (msErrorCode === 'InvalidAuthenticationToken' && retryCount < this.maxRetries) {
                const checkUpdate = await updateMsAccessToken(this.session);
                if (checkUpdate && checkUpdate.success) {
                    return this.makeApiRequest(url, parseFunction, retryCount + 1);
                }
            }

            return {
                success: false,
                message: 'Error executing request'
            };
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
}

module.exports = {
    OneDrive
}
