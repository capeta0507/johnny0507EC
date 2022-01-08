const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const MongoURL = 'mongodb://localhost:27017'
// App
const app = express();
//setting middleware
app.use(express.static(__dirname + '/public')); //主機資源設定為 public 資料夾
app.use(express.json());

// Server listen
const PORT = 8080;
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

