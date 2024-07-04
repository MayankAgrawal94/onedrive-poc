const ApiV1 = '/v1';

export const getUserDetails = async () => {
    const userResp = await fetch(`${ApiV1}/basic/user/self`);
    return userResp.json();
};

export const getFileList = async () => {
    const resp = await fetch(`${ApiV1}/ms/onedrive/files/list`);
    return resp.json();
};

export const checkLoginSession = async () => {
    const resp = await fetch(`${ApiV1}/validate/user-session`);
    return resp.json();
}