import { checkLoginSession } from '/scripts/welcome/api.js';

const navigateToAuth = (type) =>  {
    let url = null;
    switch(type) {
        case "msft": 
            url = '/v1/auth/ms/rq';
            break;
        default: 
            break;
    }
    if( url )
        window.location.href = url;
}

// Attach the function to the global scope
window.navigateToAuth = navigateToAuth;

const init = async () => {
    const session = await checkLoginSession();
    if (session.success) 
        window.location.href = session?.redirect?? '/welcome';
}

document.addEventListener('DOMContentLoaded', () => {
    init();
});