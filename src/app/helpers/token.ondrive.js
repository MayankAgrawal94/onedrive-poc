const { msRefreshAuthToken } = require('../services/auth/refreshToken');

const updateMsAccessToken = async (session) => {
    try {
        const refreshToken = session?.user?.auth?.refresh_token?? ''

        const result = await msRefreshAuthToken(refreshToken)
        if( !result ) return { success: false, message: 'Something went wrong!'};

        session.user.auth = result

        // Await the session save operation
        await session.save();
        console.log(`session: ${session?.id?? 'N/A'} for 'MS access_token' updated successfully`);

        return {
            success: true,
            message: 'Session saved successfully'
        }
    } catch (err) {
        console.error(`ERROR - updateMsAccessToken`, err.response ? err.response.data : err.message)
        return {
            success: false,
            message: err?.message?? 'Something went wrong!'
        }
    }
}

module.exports = {
    updateMsAccessToken
}