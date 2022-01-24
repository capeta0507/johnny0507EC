// const express = require('express');
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
  return true;
}
// 清除前端 Cookies : _EC0507_UserToken
const myClearClientCookies = (req,res) =>{
  res.clearCookie('_EC0507_JWTToken');
  return true;
}

module.exports = {
  my_UserJWTToken,
  myWriteClientCookies,
  myClearClientCookies
}

