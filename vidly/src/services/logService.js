// import * as Sentry from '@sentry/browser';

 function init() {}
//     Sentry.init({
//         dsn: 'https://7a91b8ba04b947a7a5b89a5823b04748@sentry.io/1307895',
        
//       });
 

function log(error){
    console.error(error)
   // Sentry.captureException(error);
}

export default {
    init,
    log
}