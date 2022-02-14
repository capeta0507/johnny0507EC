// Customers 處理 Router
const express = require('express');
const app = express();

require('dotenv').config('../.env'); // 引用 .env 環境變數
const MongoClient = require('mongodb').MongoClient;
const MongoURL = process.env.MONGODB_URL

const router = express.Router();

// banner 讀取
router.get('/banner',(req, res)=>{
  MongoClient.connect(MongoURL, (err,db)=>{
  if (err){
    console.log("MongoDB Connect error ..." + err);
  } else{
      let dbo = db.db("EC0507");
      dbo.collection("banner").find({}).toArray((err,result)=>{
        if (err){
          // 新增錯誤
          res.json({
            success : false,
            message:"/banners/banner ... 錯誤",
            error : err                                                              
          });
        } else {
          db.close();
          res.json({
            success:true,
            message:"/banners/banner ... 全banner圖",
            result : result
          });
        }
      })
    }
  })
})

module.exports = router;