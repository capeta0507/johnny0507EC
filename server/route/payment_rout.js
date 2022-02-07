// Products 處理 Router
const express = require('express');
// const app = express();
const router = express.Router();
const ecpay_payment = require('../ECPAY_Payment_node_js');  // 綠界 API
// const bodyParser = require('body-parser');

// app.use(express.json());
// var jsonParser = bodyParser.json();
// // parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }));
// // parse application/json
// app.use(bodyParser.json());

// 綠界加密處理 (測試)
const crypto = require('crypto');  // AES , SHA256 加密
let MerchantID = "2000132";//綠界,商店代號
let HashKey = "5294y06JbISpM5x9";//綠界 HashKey
let HashIV = "v77hoKGq4kWxNNIS";//綠界 HashIV
let OperationMode = "Test";//綠界 測試環境

const MongoClient = require('mongodb').MongoClient;
const MongoURL = process.env.MONGODB_URL;

// 前端：order.html -> 訂購單確認 --> 處理資料加密 --> 回傳
router.post('/ecpay',(req,res)=>{
  console.log(req.body);
  console.log('將交易資料送給綠界進行加密與產生 html 結果。');
  let base_param = {
    MerchantTradeNo: req.body.MerchantOrderNo, //20碼內 訂單編號
    MerchantTradeDate: getFromFormat('yyyy/mm/dd hh:ii:ss'), //ex: 2022/01/29 12:15:36
    TotalAmount: req.body.Amt, //200
    TradeDesc: "購物車網站商品購買", //*
    ItemName: req.body.ItemDesc, //產品名稱
    ReturnURL: "/payReturnSuccess",
    PaymentInfoURL: "/payReturnSuccess",
    ClientBackURL: "/home?pay=2", // 支付取消返回商店網址,
    InvoiceMark: 'Y',
    Remark: "",
    CustomField1: ''
  };
  console.log(base_param);
  let create = new ecpay_payment({
    "OperationMode": OperationMode, //Test or Production
    "MercProfile": {
      "MerchantID": MerchantID,
      "HashKey": HashKey,
      "HashIV": HashIV
    },
    "IgnorePayment": ["WebATM","BARCODE","CVS"], //隱藏付款方式(測試台無效)：文件22頁 IgnorePayment 
    "IsProjectContractor": false //是否為特約商店：文件22頁 PlatformID 
  });
  // 電子發票
  let inv_params = {};
  // 綠界 交易資料加密 -> html 結果
  var htm = create.payment_client.aio_check_out_all(base_param, inv_params);
  console.log(htm);
  res.json({
    statue : true,
    result : htm
  });

});

// 訂購確認 order_confirm
router.post('/order_confirm', (req,res)=>{
  // 寫到MongoDB 去 orders 的 collections
  const{userName, eMail, orderNo, description, shopCount, amt, shopArray} = req.body;

  let xOrder = {
    "eMail": eMail,
    "userName" : userName,
    "orderNo": orderNo,
    "description" : description,
    "shopCount": shopCount,
    "amt": amt,
    "shopArray": shopArray
  }
  MongoClient.connect(MongoURL,(err,db)=>{
    if (err){
			console.log("MongoDB Connect error ..." + err);
		} else {
      let dbo = db.db("EC0507");
      dbo.collection('orders').insertOne(xOrder,(err, result)=>{
        if (err){
          // 新增訂單錯誤
          res.json({
            success : false,
            message:"/payment/order_confirm ... 新增錯誤",
            error : err                                                              
          });
        }
        // 新增訂單OK
        else {
          db.close();
          res.json({
            success:true,
            message:"/payment/order_confirm ... 新增OK",
            result : result
          });
        }
      })
    }
  })

})

// 綠界 API 交易時間格式
function getFromFormat(format) {
  var d = new Date();
  var yyyy = d.getFullYear().toString();
  format = format.replace(/yyyy/g, yyyy)
  var mm = (d.getMonth()+1).toString(); 
  format = format.replace(/mm/g, (mm[1]?mm:"0"+mm[0]));
  var dd  = d.getDate().toString();
  format = format.replace(/dd/g, (dd[1]?dd:"0"+dd[0]));
  var hh = d.getHours().toString();
  format = format.replace(/hh/g, (hh[1]?hh:"0"+hh[0]));
  var ii = d.getMinutes().toString();
  format = format.replace(/ii/g, (ii[1]?ii:"0"+ii[0]));
  var ss  = d.getSeconds().toString();
  format = format.replace(/ss/g, (ss[1]?ss:"0"+ss[0]));
  return format;
  //yyyy-mm-dd hh:ii:ss
};

module.exports = router;
