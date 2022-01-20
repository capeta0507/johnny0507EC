const crypto = require('crypto');
const {myIv, myKEY, myAlgorithm} = require('./auth');

// 加密函式 my_Encrypt(明碼字串)
const my_Encrypt = (myEncryptStr) =>{
    let cipher = crypto.createCipheriv(myAlgorithm,myKEY,myIv);
    let encrypted = cipher.update(myEncryptStr,'utf-8','hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

// 解密函式 my_Decrypt(密碼字串)
function my_Decrypt(myEncryptStr){
    let decipher = crypto.createDecipheriv(myAlgorithm,myKEY,myIv);
    let decrypted = decipher.update(myEncryptStr,'hex','utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
}

module.exports = {
    my_Encrypt,
    my_Decrypt
}