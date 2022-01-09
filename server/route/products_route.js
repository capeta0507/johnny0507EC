// Products 處理 Router
const express = require('express');
require('dotenv').config('../.env'); // 引用 .env 環境變數
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const MongoURL = process.env.MONGODB_URL

// 產品讀取
router.get('/all',(req,res)=>{
  res.send('Product read all ...');
});

module.exports = router;