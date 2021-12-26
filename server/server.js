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
    let xuserName = req.body.userName;
    let xeMail = req.body.eMail;
    let xpassword = req.body.password;
    // 要建立資料的 Class
    let xCustomer ={
        userName: xuserName,
        eMail: xeMail,
        password: xpassword,
        eMailConfirm:false,
        telphone:'',
        mobile:'',
        address:'',
        personalID=''
    };
    MongoClient.connect(MongoURL,(err,db)=>{
        if (err){
            console.log("MongoDB Connect error ..." + err);
        }
        else{
            let dbo = db.db("EC0507");
            dbo.collection('customers').insertOne(xCustomer,(err,result)=>{
                if (err){
                    console.log("EC0507.customers -> Error");
                    }
                else {
                    db.close();
                    res.json(result);
                }
            });
        }
    })
})

