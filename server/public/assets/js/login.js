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

// backurl 測試
let backURL = "index.html";
backURL = getBackURL();  // 找出 backURL 

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

    // backURL = getBackURL();  // 找出 backURL : 再找一次
    
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

// 找出 BackURL = ????
function getBackURL(){
    let xbackURL = "index.html"
    let searchURL = window.location.search;
    // 有沒有參數？
    if(searchURL.length == 0){
        // 沒有
        console.log('網址 search 沒有參數... go to ' + backURL);
    }
    else {
        // 有參數
        let xHref = window.location.href;  // 網址
        console.log(xHref);
        let xSearch = xHref.split('?')[1];  // Search 參數 String
        console.log(xSearch);
        xSearchArray = xSearch.split('&');  // Search 參數 Array
        console.log(xSearchArray);
        // 巡迴 Search 參數 Array
        xSearchArray.forEach(key_value =>{
            console.log(key_value);
            // key vs value 比對
            let key_value_array = key_value.split('=');
            if(key_value_array[0] == 'backurl'){
                xbackURL = key_value_array[1];
                console.log("找到 " + xbackURL);
            }
        });
    }
    console.log('function final : ' + xbackURL);
    return xbackURL;
    
}