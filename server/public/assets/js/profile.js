// 要先取得個人資料
$(document).ready(()=>{
  let myEmail = sessionStorage.getItem('eMail');
  if (!myEmail){
    // 沒有 eMail 不執行
    return false;
  }
  axios.get(`/customers/member/${myEmail}`)
    .then(result =>{
      // console.log(res);
      if (result.data.success == true){
        $('#myTel').val(result.data.userData.telphone);
        $('#myPhone').val(result.data.userData.mobile);
        $('#myAddress').val(result.data.userData.address);
        $('#myPerson').val(result.data.userData.personalID);
      }else{
        $('#myTel').val('');
        $('#myPhone').val('');
        $('#myAddress').val('');
        $('#myPerson').val('');
      }
    })
    .catch(err =>{
      console.log(err.message);
    })

});


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
    $('#myErrTxt').text('請輸入舊密碼');
    // window.location.href = "login.html";
    return false;
  }

  $('.form-control').removeClass('sign_error');
  $('#myErrTxt').html('');
  if(!myOldPassword){
    $('#myErrTxt').text('請輸入舊密碼');
    $('#myOldPassword').addClass('sign_error');
    return false
  }
  if(!myPassword){
    $('#myErrTxt').text('請輸入新密碼');
    $('#myPassword').addClass('sign_error');
    return false
  }
  if(myPassword !== myPasswordCheck){
    $('#myErrTxt').text('您設定的密碼跟驗證的不相符喔！');
    $('#myPasswordCheck').addClass('sign_error');
    return false
  }

  if(myPassword == myOldPassword){
    $('#myErrTxt').text('您設定的密碼不可以跟原密碼一樣喔！');
    $('#myOldPassword').addClass('sign_error');
    $('#myPassword').addClass('sign_error');
    return false
  }
  let upDatePassword = {
    password: myPassword
  }
  // console.log('upDatePassword', upDatePassword)

  let loginData = {
    eMail: userEmail,
    password: myOldPassword
  }

    axios.post('/customers/login', loginData)
    .then(res=>{
      console.log(res.data);
      if (res.data.success === false){
        $('#myErrTxt').text('授權錯誤 請重新登入');
        return false
      }
      axios.put(`/customers/chpwd/${userEmail}`, upDatePassword)
      .then(res=>{
        console.log(res.data);
        if (res.data.success == true){
          $('.form-control').removeClass('sign_error');
          sessionStorage.removeItem('userName');
          sessionStorage.removeItem('eMail');
          sessionStorage.removeItem('id');
          alert("修改完成請重新登入！");
          window.location.href = "login.html";
            
        }else {
          $('#myErrTxt').text('您的密碼設置錯誤 : ' + res.data.message);
        }
      })
      .catch(error => {
        console.log(error.response);
      });
    })
    .catch(error => {
      console.log(error.response);
      $('#myErrTxt').text('您輸入的帳號密碼有誤！')
    });

    // axios.put(`/customers/member/${userEmail}`, upDatePassword)
    // .then(res=>{
    //     console.log(res.data);
    //     if (res.data.success == true){
    //         sessionStorage.removeItem('userName');
    //         sessionStorage.removeItem('eMail');
    //         sessionStorage.removeItem('id');
    //         alert("修改完成請重新登入！");
    //         window.location.href = "login.html";
            
    //     }else {
    //         alert('您的密碼設置錯誤 : ' + res.data.message);
    //     }
    // })
    // .catch(error => {
    //     console.log(error.response);
    // });
})