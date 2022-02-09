const axios = require('axios');

// console.log(axios);

let myUsername = 'ec0507';
let myPassword = 'johnnyec0507';
let myMobile = '0983720128';
let message = '親愛的客戶:\n您的訂單編號: ECx20220207153113000\n總計: 3200元'
// let message = 'Hello';

let myUrl = `http://api.twsms.com/json/sms_send.php?username=${myUsername}&password=${myPassword}&mobile=${myMobile}&message=${encodeURI(message)}`

console.log(myUrl);

axios.get(myUrl)
.then(result=>{
    console.log(result);
})
.catch(err =>{
    console.log('error', err.message);
})