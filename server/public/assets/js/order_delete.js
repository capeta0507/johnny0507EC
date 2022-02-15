// 商品數量
let myShopCount = 0;
let myBuyItem = [];

let session_cart = JSON.parse(window.sessionStorage.getItem('shopArray'));
let session_count =parseInt(window.sessionStorage.getItem('shopCount'));
// session裡 shopArray 假如有資料，將session 的資料帶入
if(session_cart !== null){
  myBuyItem = session_cart
  myShopCount = session_count
}

function order_delete(x){
  console.log('x3', x);
  let myShopItem = JSON.parse(`${sessionStorage.getItem('shopArray')}`)
  if(myShopCount > 0){
    myShopCount = sessionStorage.getItem('shopCount')
  }
  // console.log('myShopItem', myShopItem)
  myShopItem.splice(x-1,1);
  // 原始的陣列  
  myBuyItem.splice(x-1,1);
  myShopCount = myShopCount-1
  // console.log('myShopItem2', myShopItem)
  // console.log('myShopCount', myShopCount)
  // console.log('myShopItem', myShopItem)
  // console.log('myBuyItem', myBuyItem)
  $('#myCart').text(myShopCount);
  window.sessionStorage.setItem('shopArray', JSON.stringify(myShopItem));
  window.sessionStorage.setItem('shopCount', myShopCount);

  let pay_no = 0;
  cart_list = ''
  myShopItem.map(data => {
    pay_no++
    cart_list += `
      <div class="notification_single">
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
        <div class="notdelete" onclick="order_delete('${pay_no}')"><i class="fa fa-trash-alt trash_hover"></i></div>
      </div>
    `
  })
  $('#myListContent').html(cart_list);
}

function cartBtn(){
  let userName = sessionStorage.getItem('userName');
  if(userName){
      window.location.href = 'shop-order-master.html'
  } else {
      window.location.href = 'login.html?backurl=shop-order-master.html'
  }
}