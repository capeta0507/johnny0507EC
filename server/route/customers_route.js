// Customers 處理 Router
const express = require('express');
const app = express();
const RequestIp = require('@supercharge/request-ip'); // get User IP
require('dotenv').config('../.env'); // 引用 .env 環境變數
// const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const MongoURL = process.env.MONGODB_URL
// cookie-parser middleware 
// const cookieParser = require('cookie-parser');
// app.use(cookieParser());

const router = express.Router();

// 加密函式
const {my_Encrypt, my_Decrypt} = require('../auth/auth_fun');
// JWT
const {my_UserJWTToken,myWriteClientCookies,myClearClientCookies,myJWTVerify} = require('../auth/jwt_fun');

// 客戶註冊/登入
// Database : EC0507
// Collection : customers
// 新增客戶
router.post('/add',(req,res)=>{

	const{userName,eMail,password} = req.body;
	// TODO : 
  //   2. 個人資料維護 _id: 識別，email: 識別 不能改

  // email帳號必須唯一
	let xLogin ={
		eMail: eMail,
	};
	// console.log('email', xLogin);
	MongoClient.connect(MongoURL,(err,db)=>{
		if (err){
			console.log("MongoDB Connect error ..." + err);
		} else {
			let dbo = db.db("EC0507");
			dbo.collection('customers').find(xLogin).toArray((err, result)=>{
				if (err){
					res.json({
						success:false,
						message:"資料庫 ... 錯誤",
						error:err
					});
				} else {
					// console.log('result',result);
					db.close();
					if (result.length > 0){
						// 客戶已存在
						// console.log('客戶已存在')
						res.json({
							success:false,
							message:"註冊錯誤 ... 此email已註冊過"
						});
						// return false;
					}else {
						// 可以註冊的資料
						// 加密處理
						let encrypted = my_Encrypt(password);
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
						// console.log(xCustomer);
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
					}
				}
			})
		}
	})
});

// 登入
// Database : EC0507
// Collection : customers -> userName , eMail , password
router.post('/login',(req,res)=>{
	// myJWTVerify
	// myJWTVerify(req,res);
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
					let decrypted = my_Decrypt(result[0].password);
					// console.log('密碼 ',decrypted);
					if (decrypted !== password) {
						// console.log('密碼錯誤');
						res.json({
							success:false,
							message:"... 帳密錯誤",
						});
						return false;
					}
					// 將 JWT Token _EC0507_JWTToken 寫到 Client Cookies
					let userIP = createUserIP(req,res);
					// 取得 JWT Token
					let myToken = my_UserJWTToken(result[0].userName,result[0].eMail,result[0]._id,userIP);
					// 寫到 Client 端 Cookies // 24小時有效
					myWriteClientCookies(req,res,myToken);
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
})

// 登出，清除 Client Cookies : _EC0507_JWTToken
router.post('/logout',(req,res) => {
	let JWTInfo = myJWTVerify(req,res);
	// console.log(JWTInfo);
	if (JWTInfo.success == true){
		myClearClientCookies(req,res);
		res.json({
			success : true,
			message : "成功登出"
		});
	}
	else{
		myClearClientCookies(req,res);
		res.json({
			success : false,
			message : "登出錯誤 ..." + JWTInfo.message
		});
	}
});

// Who am I : 取得 Cookies : _EC0507_JWTToken 資料
router.post('/client_whoami',(req,res)=>{
	let JWTInfo = myJWTVerify(req,res);
	// console.log(JWTInfo);
	if (JWTInfo.success == true){
		res.json({
			success : true,
			message : "JWT資料",
			token:JWTInfo
		});
	}
	else{
		res.json({
			success : false,
			message : "JWT資料...尚未登入 : " + JWTInfo.message,
			token:""
		});
	}
});

router.get('/client_whoami',(req,res)=>{
	let JWTInfo = myJWTVerify(req,res);
	// console.log(JWTInfo);
	if (JWTInfo.success == true){
		res.json({
			success : true,
			message : "JWT資料",
			token:JWTInfo
		});
	}
	else{
		res.json({
			success : false,
			message : "JWT資料...尚未登入 : " + JWTInfo.message,
			token:""
		});
	}
});

// 獲取個人資料
router.get('/member/:eMail',(req,res)=>{
  // console.log('/member/:eMail (GET)');
  MongoClient.connect(MongoURL,(err,db)=>{
    if (err){
			console.log("MongoDB Connect error ..." + err);
		} else {
      let dbo = db.db("EC0507");
			let eMail = req.params.eMail;
			// console.log('eMail',eMail);
      let xEmail ={
        eMail: eMail,
      };
      // console.log('Query No : ' , xEmail);
      dbo.collection("customers").find(xEmail).toArray((err,result)=>{
        if(err){
          res.json({
            success:false,
            message:"/member/:eMail ... 找尋錯誤",
          });
        } else {
					db.close();
					res.json({
						success : true,
						message : "找到人",
						userData : {
							userName:result[0].userName, 
							eMail:result[0].eMail,
							id: result[0]._id,
							telphone : result[0].telphone,
							mobile : result[0].mobile,
							address: result[0].address,
							personalID: result[0].personalID
						}
					});
        }
    	})
    }
  })
})

// 修改密碼
router.put('/chpwd/:eMail', (req,res)=>{
	// console.log('/member/:eMail (PUT)');
	let myEmail = req.params.eMail;
	// console.log('PUT', myEmail);   // 沒寫的話是 'null' (字串)
	if(myEmail == 'null'){
		res.json({
			success:false,
			message:"eMail 不存在",
			result:''
		});
		return false;
	}

	MongoClient.connect(MongoURL,(err,db)=>{
		if (err){
			console.log("MongoDB Connect error ..." + err);
		} else {
			// TODO : 先驗證舊密碼是否正確
			let dbo = db.db("EC0507");
			let xPassword = req.body.password;
			// 加密
			xPassword = my_Encrypt(xPassword);
			// console.log('xPassword', xPassword)
			let myFind = {eMail: myEmail}; // 搜尋條件
			let myNewPassword = {       // 修改紀錄 Class
				$set:{
					password: xPassword,
				}
			}
			dbo.collection('customers').updateOne(myFind, myNewPassword,(err, result)=>{
				if(err){
					res.json({
						success:false,
						message:"/customers/updatePassword ... 錯誤",
					});
				} else {
          db.close();
          res.json({
						success:true,
						message:"密碼修改OK",
						result:result
					});
        }
			})
		}
	})
})

// 取得使用者的 IP Address
const createUserIP = (req, res) => {
	const ip = RequestIp.getClientIp(req);
	let ipStr = "";
	if(ip === "::1") {
		ipStr = 'localhost';
	}
	else{
		// ::ffff:192.168.0.155 切出 ip
		ipStr = ip.split(':')[3];
	}
	return ipStr;
}

module.exports = router;