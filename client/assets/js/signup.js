// 明碼暗碼switch
$('#passCheck01').on('click', function(){
    $('#passCheck01').hide();
    $('#passCheck01_1').show();
    $('#myPassword').attr('type', 'text');
});
$('#passCheck01_1').on('click', function(){
    $('#passCheck01').show();
    $('#passCheck01_1').hide();
    $('#myPassword').attr('type', 'password');
});

$('#passCheck02').on('click', function(){
    $('#passCheck02').hide();
    $('#passCheck02_1').show();
    $('#myPasswordCheck').attr('type', 'text');
});
$('#passCheck02_1').on('click', function(){
    $('#passCheck02').show();
    $('#passCheck02_1').hide();
    $('#myPasswordCheck').attr('type', 'password');
});

// TODO : 資料驗證
// 1. email撰寫格式是否正確
// 2. password check是否相同

// 送出資料
$('#mySubmit').on('click', function(){
    let emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;

    let myName = $('#myName').val();
    let myEmail = $('#myEmail').val();
    let myPassword = $('#myPassword').val();
    let myPasswordCheck = $('#myPasswordCheck').val();
    // 輸入姓名
    if(myName == ""){
        alert('請輸入您的姓名');
        return false
    }
    // 密碼確認
    if(myPassword == ""){
        alert('請輸入密碼');
        return false
    }
    if(myPassword !== myPasswordCheck){
        alert('您設定的密碼跟驗證的不相符喔！');
        return false
    }
    // email 格式
    if(myEmail == ""){
        alert('請輸入電子郵件');
        return false
    }
    if(myEmail.search(emailRule)){
        alert('您輸入的email格式有誤');
        return false
    }

    let SignUpData = {
        userName: myName,
        eMail: myEmail,
        password: myPassword,
        eMailConfirm: false,
        telphone: "",
        mobile: "",
        address: "",
        personalID: ""
    }

    axios.post('/customers/add', SignUpData)
        .then(res => {
            console.log(res)
        })
        .catch(error => {
            console.log(error.response);
        });
});