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

$('#mySubmit').on('click', function(){
    let emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;

    let myEmail = $('#myEmail').val();
    let myPassword = $('#myPassword').val();
    let userName = '';
    let eMail = "";
    let id = "";
    // console.log(myEmail, myPassword);

    let loginData = {
        eMail: myEmail,
        password: myPassword
    }
    // email 格式
    if(myEmail == ""){
        alert('請輸入帳號');
        return false
    }
    if(myEmail.search(emailRule)){
        alert('您輸入的email格式有誤');
        return false
    }
    // 密碼
    if(myPassword == ""){
        alert('請輸入密碼');
        return false
    }

    // 是否有 Call back URL ?
    let backURL = window.location.search;
    backURL = backURL.split('=');
    backURL = backURL[1]
    console.log('backURL', backURL)
    // 取得 Call back URL 位址

    axios.post('/customers/login', loginData)
        .then(res => {
            console.log(res.data);
            if (res.data.success === true){
                userName = res.data.result.userName;
                eMail = res.data.result.eMail;
                id = res.data.result.id;
                // console.log(userName);
                // 暫時用sessionStorage存
                sessionStorage.setItem('userName', userName);
                sessionStorage.setItem('eMail', eMail);
                sessionStorage.setItem('id', id);
                // 前往 call back URL 位址
                window.location.href = backURL;
            }else{
							// alert('您輸入的帳密有誤，請重新輸入！')
							alert('登入產生錯誤:' + res.data.message);
						}
        })
        .catch(error => {
            console.log(error.response);
            alert('您輸入的帳號密碼有誤！')
        });
})