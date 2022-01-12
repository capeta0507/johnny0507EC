// Products 處理 Router
const express = require('express');
require('dotenv').config('../.env'); // 引用 .env 環境變數
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const MongoURL = process.env.MONGODB_URL
// 借用
const products = require('../public/shop/product/product.json');

// 產品讀取
router.get('/category/:cat',(req,res)=>{
  let myCat = req.params.cat;
  // console.log(myCat);
  // 搜尋條件
  let xCategory = {
    category: myCat,
  };
  // 參數 All 代表全部
  if (myCat == 'All'){
    xCategory = {
      // 全部
    }
  }
  // console.log(xCategory);
  // 讀取資料
  MongoClient.connect(MongoURL,(err,db)=>{
    if (err){
			console.log("MongoDB Connect error ..." + err);
		} else{
      let dbo = db.db("EC0507");
			dbo.collection("products").find(xCategory).toArray((err,result)=>{
        if(err){
          res.json({
            success:false,
            message:"/category/:cat ... 找尋錯誤",
          });
        }else {
          db.close();
          res.json({
            success:true,
            message:"成功讀取商品資料",
            result:result
          });
        }
      })
    }
  })
});

module.exports = router;