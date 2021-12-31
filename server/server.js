const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const MongoURL = 'mongodb://localhost:27017'
// App
const app = express();
//setting middleware
app.use(express.static(__dirname + '/public')); //主機資源設定為 public 資料夾
app.use(express.json());

// 加密演算
const crypto = require('crypto');
// let myIv = 'd55daa8fb6a348ee';  // 16位元 IV
// let myKEY = '0123456789-0123456789-0123456789'  // 32位元 使用者自訂
// let myAlgorithm = 'aes-256-cbc'  // 加密演算法
const {myIv, myKEY, myAlgorithm} = require('./auth/auth');

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

// app.get('/', (req, res) => {
//   res.send('Node.js + Express.js + EC');
// });

// 客戶註冊/登入
// Database : EC0507
// Collection : customers
// 新增客戶
app.post('/customers/add',(req,res)=>{
	const{userName,eMail,password} = req.body;
	// TODO : 
	//   1. password 要加密，在儲存進資料庫  okˇ
	//   2. eMail 不應該重複

  // 加密處理
  let cipher = crypto.createCipheriv(myAlgorithm,myKEY,myIv);
  let encrypted = cipher.update(password, 'utf-8', 'hex');
  encrypted += cipher.final('hex');

  // console.log('加密前', password);
  // console.log('加密後', encrypted);

	// 要建立資料的 Class
	let xCustomer ={
		userName: userName,
		eMail: eMail,
		password: encrypted,
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

// 登入
// Database : EC0507
// Collection : customers -> userName , eMail , password
app.post('/customers/login',(req,res)=>{
	// 根據前端 eMail + password 讀取資料來判斷帳密是否正確
	// 回傳 _id , userName
    const{eMail,password} = req.body;
    let xLogin ={
			eMail: eMail,
		};
    // console.log(xLogin)
    MongoClient.connect(MongoURL,(err,db) =>{
        if (err){
            console.log("MongoDB Connect error ..." + err);
        }
        else{
            let dbo = db.db("EC0507");
            dbo.collection('customers').find(xLogin).toArray((err,result)=>{
                if (err){
									// console.log("查無此帳號");
									// console.log(err);
									res.json({
										success:false,
										message:"/customers/login ... 登入錯誤",
									});
                }
                else {
									// console.log(result);
									db.close();
									if(result.length === 0){
										console.log('查無此帳號');
										res.json({
											success:false,
											message:"... 查無此帳號",
										});
										return false;
									}

                  // 解密處理
                  let decipher = crypto.createDecipheriv(myAlgorithm,myKEY,myIv);
                  let decrypted = decipher.update(result[0].password , 'hex', 'utf-8');
                  decrypted += decipher.final('utf-8');

                  // console.log('解密前', result[0].password);
                  // console.log('解密後', decrypted);

									if (decrypted !== password) {
										// console.log('密碼錯誤');
										res.json({
											success:false,
											message:"... 帳密錯誤",
										});
										return false;
									}
									// 正常回傳紀錄
									res.json({
										success : true,
										message : "登入成功",
										result : {
											userName:result[0].userName, 
											eMail:result[0].eMail,
											id: result[0]._id
										}
									});
                }
            });
        }
    })
});


