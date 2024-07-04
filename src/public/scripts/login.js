
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