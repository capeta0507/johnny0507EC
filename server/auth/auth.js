// 客戶資料加密參數
// const myIv = '';  // 16位元 IV
// const myKEY = ''  // 32位元 使用者自訂
// const myAlgorithm = ''  // 加密演算法

require('dotenv').config('../.env'); // 引用 .env 環境變數

const myIv = process.env.AUTH_IV;  // 16位元 IV
const myKEY = process.env.AUTH_KEY  // 32位元 使用者自訂
const myAlgorithm = process.env.AUTH_ALGORITHM  // 加密演算法

const myJWTSecutit = process.env.AUTH_ALGORITHM  // JWT securit 加密

module.exports = {
    myIv,
    myKEY,
    myAlgorithm,
    myJWTSecutit
}