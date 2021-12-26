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
    // 密碼確認
    if(myPassword !== myPasswordCheck){
        alert('您設定的密碼跟驗證的不相符喔！')
        return false
    }
    // email 格式
    if(myEmail.search(emailRule)){
        alert('您輸入的email格式有誤')
        return false
    } else {
        alert('email成功！')
    }
});