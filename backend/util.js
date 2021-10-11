const crypto = require('crypto');
var jwt = require('jsonwebtoken');

const BOT_TOKEN = process.env.BOT_TOKEN;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
console.log(BOT_TOKEN)
module.exports = {
    checkTGHash: async function (checkObj) {

        let hash = checkObj.hash;
        delete checkObj.hash
        let str = '';
        let sortedKeys = Object.keys(checkObj).sort();
        for (let i = 0; i < sortedKeys.length; i++) {
            let k = sortedKeys[i];
            str = str.concat(k).concat("=").concat(checkObj[k]);
            if (i < sortedKeys.length - 1) {
                str = str.concat("\n");
            }
        }
        let secret_key = crypto.createHash("sha256").update(BOT_TOKEN).digest();
        let hmac = crypto.createHmac('sha256', secret_key).update(str).digest('hex');
        return hmac === hash;

    },
    sign: async function (payload) {
        var token = jwt.sign(payload, JWT_SECRET_KEY, {expiresIn: 60 * 60*999999});
        return token;
    },
    verify: async function (token) {
        var decoded = jwt.verify(token, JWT_SECRET_KEY);
        return decoded;
    }
}