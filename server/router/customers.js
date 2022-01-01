// Customers 處理 Router
const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const MongoURL = 'mongodb://localhost:27017'

// 加密函式
const {my_Encrypt, my_Decrypt} = require('../auth/auth_fun');

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
})

// 獲取個人資料
router.get('/member/:eMail',(req,res)=>{
  console.log('/member/:eMail (GET)');
  MongoClient.connect(MongoURL,(err,db)=>{
    if (err){
			console.log("MongoDB Connect error ..." + err);
		} else {
      let dbo = db.db("EC0507");
      let eMail = req.params.eMail;
      let xEmail ={
        eMail: eMail,
      };
      console.log('Query No : ' + xEmail);
      dbo.collection("customers").find(xEmail).toArray((err,result)=>{
        if(err){
          res.json({
						success:false,
						message:"/customers/lmemberogin ... 找尋錯誤",
					});
        } else {
            db.close();
            // res.json({
            //   success : true,
            //   message : "找到人",
            //   result : {
            //     userName:result[0].userName, 
            //     eMail:result[0].eMail,
            //     id: result[0]._id
            //   }
            // });
            res.json(result);
        }
    })
    }
  })
})


module.exports = router;