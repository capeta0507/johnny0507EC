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
    let myEmail = $('#myEmail').val();
    let myPassword = $('#myPassword').val();
    console.log(myEmail, myPassword);
})