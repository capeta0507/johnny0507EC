// 明碼暗碼switch
$('#passOld01').on('click', function(){
    $('#passOld01').hide();
    $('#passOld01_1').show();
    $('#myOldPassword').attr('type', 'text');
});
$('#passOld01_1').on('click', function(){
    $('#passOld01').show();
    $('#passOld01_1').hide();
    $('#myOldPassword').attr('type', 'password');
});

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

// 修改密碼送出
$('#myChange').on('click', function(){
    let myOldPassword = $('#myOldPassword').val();
    let myPassword = $('#myPassword').val();
    let myPasswordCheck = $('#myPasswordCheck').val();

    let userEmail = sessionStorage.getItem('eMail');
      if (!userEmail){
        alert('授權錯誤，必須先登入');
        // window.location.href = "login.html";
        return false;
    }

    $('.form-control').removeClass('sign_error');
    if(!myOldPassword){
        alert('請輸入舊密碼')
    }
    if(!myPassword){
        alert('請輸入新密碼')
    }
    if(myPassword !== myPasswordCheck){
        alert('您設定的密碼跟驗證的不相符喔！')
    }
    let upDatePassword = {
        password: myPassword
    }
    // console.log('upDatePassword', upDatePassword)
    axios.put(`/customers/member/${userEmail}`, upDatePassword)
    .then(res=>{
        console.log(res.data);
        if (res.data.success == true){
            sessionStorage.removeItem('userName');
            sessionStorage.removeItem('eMail');
            sessionStorage.removeItem('id');
            alert("修改完成請重新登入！");
            window.location.href = "login.html";
            
        }else {
            alert('您的密碼設置錯誤 : ' + res.data.message);
        }
    })
    .catch(error => {
        console.log(error.response);
    });
})