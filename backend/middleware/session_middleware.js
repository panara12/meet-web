const crypto = require('crypto');

const generateCookieName =  ( role, username) => {
    const hash =  crypto.createHash('md5').update(username).digest('hex');
    return `sid_${role}_${hash}`;
}

function attachCustomCookie(req, cookieName) {
    req.session.name = cookieName;
    return true;
}

module.exports = { 
    generateCookieName, 
    attachCustomCookie
};
