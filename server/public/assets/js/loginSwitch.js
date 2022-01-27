function loginSwitch(){
    // console.log('ready');
    $('.userTag').on('click', function(){
        $('.drapdown').stop().fadeToggle(300);
        $('.down-arrow').toggleClass("arrow-up");
    });
    // 登出
    $('#myLogout').on('click', function(){
        // sessionStorage.removeItem('userName');
        // sessionStorage.removeItem('eMail');
        // sessionStorage.removeItem('id');
        sessionStorage.clear();
        // 登出
        axios.post('/customers/logout')
            .then(res =>{
                console.log(res.data);
                if(res.data.success === true){
                    window.location.href = "index.html";
                }
                else{
                    window.location.href = "index.html";
                }
            })
            .catch(err =>{
                alert('登出錯誤:' + res.data.message);
            })
        
    });
    // 登入後
    let userName = sessionStorage.getItem('userName');
    // console.log('session', userName);
    $('#myName').text(userName);
    if(userName){
        // console.log('find');
        $('#mySign').hide();
        $('#myUser').show();
    } else {
        console.log('not find');
        $('#mySign').show();
        $('#myUser').hide();
    }
    // console.log('end')
    // 購物車
    $('.shop_cart').on('click', function(){
        $('.notification_block').show();
        $('#myList').toggleClass("active");
    });
    $('.notification_block').on('click', function(){
        $('.notification_block').hide();
        $('#myList').removeClass("active");
    });
    $('.notification_single').on('click', function(){
        $('#myList').removeClass("active");
    });
}

function includeHTML() {
    var z, i, elmnt, file, xhttp;
    /* Loop through a collection of all HTML elements: */
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
        elmnt = z[i];
        /*search for elements with a certain atrribute:*/
        file = elmnt.getAttribute("w3-include-html");
        if (file) {
        /* Make an HTTP request using the attribute value as the file name: */
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4) {
            if (this.status == 200) {elmnt.innerHTML = this.responseText;}
            if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
            /* Remove the attribute, and call this function once more: */
            elmnt.removeAttribute("w3-include-html");
            includeHTML();
            }
        }
        xhttp.open("GET", file, true);
        xhttp.send();
        
        
        /* Exit the function: */
        return;
        }
    }
    // 顯示註冊與登入
    loginSwitch();
    // 顯示購物車數量
    let myCart = JSON.parse(`${sessionStorage.getItem('shopArray')}`)
    let myShopCount = sessionStorage.getItem('shopCount')
    let cart_list = ''
    console.log('myCart', myCart)
    if(myCart){
        $('#myCart').text(myShopCount);
        myCart.map((data)=>{
            cart_list += `
                <a href="#" class="notification_single" target="_blank">
                    <div class="notleft">
                    <div class="notImg">
                        <img src="shop/product/${data.photo}" alt="">
                    </div>
                    </div>
                    <div class="notright">
                    <div>名稱：${data.name}</div>
                    <div>數量：${data.qty}</div>
                    <div>價格：NT$ ${data.total}</div>
                    </div>
                </a>
            `
        });
        $('.cart_payBtn').show();
        document.getElementById('myListContent').innerHTML = cart_list
    }
    if(myShopCount > 0){
        $('#myCart').removeClass('cart_none');
    }

}

function shopCategoru(category){
    // console.log('category', category)
    sessionStorage.setItem('shop_cate', category);
}