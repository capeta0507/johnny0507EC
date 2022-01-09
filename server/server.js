const express = require('express');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config(); // 引用 .env 環境變數
const MongoURL = process.env.MONGODB_URL
// App
const app = express();
//setting middleware
app.use(express.static(__dirname + '/public')); //主機資源設定為 public 資料夾
app.use(express.json());

// Server listen
const PORT = process.env.PORT || 8080;
app.listen(PORT,()=>{
  console.log(`Running on http://localhost:${PORT}`);
  MongoClient.connect(MongoURL,(err,db)=>{
	if (err){
		console.log("MongoDB Connect error ..." + err);
	}
	else{
		console.log("MongoDB Connect OK ..." + MongoURL);
		db.close();
	}
  });
});

// Customers Router
const custRouter = require('./route/customers_route');
app.use('/customers',custRouter);

// Products router
const prodRouter = require('./route/products_route');
app.use('/products',prodRouter);
