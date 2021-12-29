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

    axios.post('/customers/login', loginData)
        .then(res => {
            console.log(res.data);
            userName = res.data[0].userName;
            // console.log(userName);
            // 暫時用sessionStorage存
            sessionStorage.setItem('userName', userName);
            window.location.href = "index.html";
        })
        .catch(error => {
            console.log(error.response);
            alert('您輸入的帳號密碼有誤！')
        });
})