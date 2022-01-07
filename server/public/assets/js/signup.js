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

    $('.form-control').removeClass('sign_error');
    $('#myErrTxt').html('');
    // 輸入姓名
    if(!myName){
        $('#myErrTxt').text('請輸入您的姓名');
        $('#myName').addClass('sign_error');
        return false
    }
    // email 格式
    if(!myEmail){
        $('#myErrTxt').text('請輸入電子郵件');
        $('#myEmail').addClass('sign_error');
        return false
    }
    if(myEmail.search(emailRule)){
        $('#myErrTxt').text('您輸入的email格式有誤');
        $('#myEmail').addClass('sign_error');
        return false
    }
    // 密碼確認
    if(!myPassword){
        $('#myErrTxt').text('請輸入密碼');
        $('#myPassword').addClass('sign_error');
        return false
    }
    if(myPassword !== myPasswordCheck){
        $('#myErrTxt').text('您設定的密碼跟驗證的不相符喔！');
        $('#myPassword').addClass('sign_error');
        $('#myPasswordCheck').addClass('sign_error');
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
            if (res.data.success == false){
                // 用alert
                alert(res.data.message);
                $('#myEmail').addClass('sign_error');
                // 用text
                $('#myErrTxt').text(res.data.message);
                return false;
            }
            console.log(res.data);
            setTimeout(() => {
                alert("恭喜您完成註冊！請至首頁登入喔！");
                window.location.href = "login.html";
            },50);
        })
        .catch(error => {
            console.log(error.response);
        });
    // var myHeaders = new Headers();
    // myHeaders.append("Content-Type", "application/json");

    // var raw = JSON.stringify({
    //     "userName": myName,
    //     "eMail": myEmail,
    //     "password": myPassword
    // });

    // var requestOptions = {
    //     method: 'POST',
    //     headers: myHeaders,
    //     body: raw,
    //     redirect: 'follow'
    // };

    // fetch("/customers/add", requestOptions)
    //     .then(response => response.text())
    //     .then(result => console.log(result))
    //     .catch(error => console.log('error', error));
});