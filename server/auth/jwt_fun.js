const express = require('express');
const app = express();
// cookie-parser middleware 
const cookieParser = require('cookie-parser');
app.use(cookieParser());
// 載入 jwt 函式庫協助處理建立/驗證 token
const jwt = require('jsonwebtoken');
const {myJWTSecutit} = require('./auth');

const my_UserJWTToken = (userName, eMail, userID, userIP) =>{
  let jwtToken={};
  let user = {
    "userName":userName,
    "eMail":eMail,
    "userID":userID,
    "admin": false,
    "customer": true,
    "userIP":userIP,
    "title": "JWT認證"
  }
  // JWT 產生驗證 token
  // JWT securit 'jwtsecuritstring' 寫在 env 變數
  let myToken = jwt.sign(user, myJWTSecutit, {
    expiresIn: 60*60*24   // 60秒 x 60分 x 24時 (一天) // 過期時間
  });
  // 回傳一個 token 給使用者做認證，將來都需要傳送有效認證才能處理。
  // console.log('my_UserJWTToken',my_UserJWTToken);
  return myToken;
}
// 寫給前端 Cookies : _EC0507_UserToken
const myWriteClientCookies = (req,res,jwt_token) =>{
  // console.log('myWriteClientCookies',jwt_token);
  res.cookie('_EC0507_JWTToken',jwt_token,{
    maxAge: 1000 * 60 * 60 * 24,  // 24小時
    httpOnly: true,
  });
  res.cookie('_EC0507_xCode',"JOHNNY_EC0507",{
    maxAge: 1000 * 60 * 60 * 24,  // 24小時
    httpOnly: true,
  });
  res.cookie('_EC0507_xMethod',"FrontEnd-BackEnd",{
    maxAge: 1000 * 60 * 60 * 24,  // 24小時
    httpOnly: true,
  });
  return true;
}
// 清除前端 Cookies : _EC0507_UserToken
const myClearClientCookies = (req,res) =>{
  res.clearCookie('_EC0507_JWTToken');
  res.clearCookie('_EC0507_xCode');
  res.clearCookie('_EC0507_xMethod');
  return true;
}
// 驗證、取得 JWT 資料
const myJWTVerify = (req,res) =>{
  let cookieStr = req.headers.cookie;
  let myJWTStr = "";
  let myInfo = {};
  if(!cookieStr){
    // console.log('No Cookies');
    myInfo = {
      success: false,
      message: 'No cookies'
    };
  }
  else{
    let strArr = cookieStr.split(';');
    for(let i = 0; i < strArr.length; i++){
      // console.log(strArr[i]);
      let strCookie = strArr[i].split("=");
      let cookie_KEY = strCookie[0].trim();
      let cookie_VALUE = strCookie[1].trim();
      // console.log(cookie_KEY);
      // console.log(cookie_VALUE);
      if (cookie_KEY === "_EC0507_JWTToken") {
        myJWTStr = cookie_VALUE;
        // break;
      }
    }
    if (myJWTStr.length == 0){
      // console.log("JWT Error... No JWT Token");
      myInfo = {
        success: false,
        message: 'JWT Error... No JWT Token'
      };
    }
    else{
      jwt.verify(myJWTStr,myJWTSecutit,(err,decoded) =>{
        if (err){
          // console.log("JWT Error...驗證錯誤");
          myInfo = {
            success: false,
            message: 'JWT Error... 驗證錯誤'
          };
        }
        else{
          // console.log('JWT Token',decoded);
          myInfo = {
            success: true,
            message: 'JWT Yes... 驗證錯誤',
            JWTInfo: decoded
          };
        }
      });
    }
  }
  // console.log(myInfo);
  return myInfo;
}

module.exports = {
  my_UserJWTToken,
  myWriteClientCookies,
  myClearClientCookies,
  myJWTVerify
}

