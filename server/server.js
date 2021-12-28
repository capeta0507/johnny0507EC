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

app.get('/', (req, res) => {
  res.send('Node.js + Express.js + EC');
});

// 客戶註冊/登入
// Database : EC0507
// Collection : customers
// 新增客戶
app.post('/customers/add',(req,res)=>{
	const{userName,eMail,password} = req.body;
	// TODO : password 要加密，在儲存進資料庫
	// 要建立資料的 Class
	let xCustomer ={
		userName: userName,
		eMail: eMail,
		password: password,
		eMailConfirm:false,
		telphone:'',
		mobile:'',
		address:'',
		personalID:''
	};
	MongoClient.connect(MongoURL,(err,db)=>{
		if (err){
				console.log("MongoDB Connect error ..." + err);
		}
		else{
			let dbo = db.db("EC0507");
			dbo.collection('customers').insertOne(xCustomer,(err,result)=>{
				if (err){
					// 新增錯誤
					res.json({
						success : false,
						message:"/customers/add ... 新增錯誤",
						error : err                                                              
					});
				}
				// 新增OK
				else {
					db.close();
					res.json({
						success:true,
						message:"/customers/add ... 新增OK",
						result : result
					});
				}
			});
		}
	})
});

// TODO : 新增登入
// Database : EC0507
// Collection : customers -> userName , eMail , password
app.post('/customers/login',(req,res)=>{
	// 根據前端 eMail + password 讀取資料來判斷帳密是否正確
	// 回傳 _id , userName
});


