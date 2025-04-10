function hashPass(password) {
    const hash = crypto.createHmac('md5', secret) // Using HMAC with MD5 and a secret key
        .update(password) // Update with the data to hash
        .digest('hex'); // Output in hexadecimal format
    return hash;
}


function getjwt(user) {
    var token = jwt.sign({

        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
        data: user
    }, secret);
    return token;
}

function verifyJwt(token) {
    try {
        var decoded = jwt.verify(token, secret);
        return decoded.data;

    } catch (error) {
        return null
    }
}

module.exports = {hashPass, getjwt, verifyJwt}