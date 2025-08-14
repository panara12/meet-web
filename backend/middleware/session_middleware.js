// sessionFactory.js (for login only)
const crypto = require('crypto');

function generateCookieName(tenant, role, username) {
    // console.log("generate cookie called")
    const hash = crypto.createHash('md5').update(username).digest('hex');
    return `sid_${tenant}_${role}_${hash}`;
}

function attachCustomCookie(req, cookieName) {
    // console.log("attach cookie called")
    req.session.name = cookieName; // rename the cookie
    return true;
}

module.exports = { generateCookieName, attachCustomCookie };
