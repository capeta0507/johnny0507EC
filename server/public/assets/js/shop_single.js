// 獲取網址參數
var urlNo = window.location.search;

urlNo = urlNo.split('=');
var itemNo = urlNo[1];
// 商品
let shopItem = '';
// 分類
let classification = '';
// 相關
let relatedCard = ''
// 商品數量
let myShopCount = 0;
let myBuyItem = [];
let sessionBuyGet = '';
// 商品
let myProductName = '';
let myProductPrice = '';
let myProductImg = '';
let myProductTotal = '';

let cart_list = '';

// console.log('url', urlNo);

var category = 'All'

let session_cart = JSON.parse(window.sessionStorage.getItem('shopArray'));
let session_count =parseInt(window.sessionStorage.getItem('shopCount'));
// session裡 shopArray 假如有資料，將session 的資料帶入
if(session_cart !== null){
  myBuyItem = session_cart
  myShopCount = session_count
}

shop_item(itemNo)

function shop_item(no){
  axios.get(`/products/item/${no}`)
  .then(result=>{
    if (result.data.success == true){
      // console.log(result.data.result[0].category)
      category = result.data.result[0].category
      if(category === 'Movie'){
        classification = '電影/影片'
      }
      if(category === 'Fashion'){
        classification = '潮流/品牌'
      }
      if(category === 'Toy'){
        classification = '玩具/模型'
      }
      myProductName = result.data.result[0].name
      myProductPrice = result.data.result[0].price
      myProductImg = result.data.result[0].photo
      shopItem = `
        <div class="row">
          <div id="myImg" class="col-lg-5 mt-5">
            <div class="card mb-3">
              <img class="card-img img-fluid" src="shop/product/${result.data.result[0].photo}" alt="Card image cap" id="product-detail">
            </div>
          </div>
          <!-- col end -->
          <div class="col-lg-7 mt-5">
            <div class="card">
              <div class="card-body">
                <h1 class="h2">${result.data.result[0].name}</h1>
                <p class="h3 py-2">NT$ ${result.data.result[0].price}</p>
                <p id="itemStar" class="py-2">
                  ${'<i class="fa fa-star text-warning"></i>'.repeat(result.data.result[0].star)}
                  ${'<i class="fa fa-star text-secondary"></i>'.repeat(5 - result.data.result[0].star)}
                </p>
                <ul class="list-inline">
                  <li class="list-inline-item">
                    <h6>分類:</h6>
                  </li>
                  <li class="list-inline-item">
                    <p class="text-muted"><strong>${classification}</strong></p>
                  </li>
                </ul>

                <h6>Description:</h6>
                <p>${result.data.result[0].name} ${result.data.result[0].description}</p>

                <h6>Specification:</h6>
                <ul class="list-unstyled pb-3">
                  <li>${result.data.result[0].name}</li>
                  <li>${result.data.result[0].description}</li>
                </ul>

                <div class="row pb-3">
                  <div class="col d-grid">
                    <button class="btn btn-success btn-lg" value="buy">Buy</button>
                  </div>
                  <div class="col d-grid">
                    <button class="btn btn-success btn-lg" value="addtocard" onclick="addCart()">Add To Cart</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `
      document.getElementById('myItem').innerHTML = shopItem;
      // 相關
      related(category)
    } else {
      console.log('查無資料');
    }
  })
  .catch(err =>{
    console.log(err.message);
  })
}

// add cart
function addCart(){
  myShopCount++
  $('#myCart').removeClass('cart_none');
  // console.log('urlNo', urlNo[1], myShopCount);
  let myItem = {
    "no": urlNo[1],
    "name": myProductName,
    "price": myProductPrice,
    "qty": 1,
    "total": myProductPrice * 1,
    "photo": myProductImg
  }
  myBuyItem.push(myItem);
  window.sessionStorage.setItem('shopArray', JSON.stringify(myBuyItem));
  window.sessionStorage.setItem('shopCount', myShopCount);
  sessionBuyGet = JSON.parse(`${sessionStorage.getItem('shopArray')}`)
  // console.log('sessionBuyGet', sessionBuyGet)
  cart_list = ''
  let pay_no = 0;
  sessionBuyGet.map(data => {
    pay_no++
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
        <div class="notdelete" onclick="order_delete('${pay_no}')"><i class="fa fa-trash-alt trash_hover"></i></div>
      </a>
    `
  })
  $('.cart_payBtn').show();
  $('#myListContent').html(cart_list);
  $('#myCart').text(myShopCount);
}

// function order_delete(x){
//   console.log('x2', x);
//   let myShopItem = JSON.parse(`${sessionStorage.getItem('shopArray')}`)
//   if(myShopCount > 0){
//     myShopCount = sessionStorage.getItem('shopCount')
//   }
//   // console.log('myShopItem', myShopItem)
//   myShopItem.splice(x-1,1);
//   // 原始的陣列  
//   myBuyItem.splice(x-1,1);
//   myShopCount = myShopCount-1
//   // console.log('myShopItem2', myShopItem)
//   // console.log('myShopCount', myShopCount)
//   // console.log('myShopItem', myShopItem)
//   // console.log('myBuyItem', myBuyItem)
//   $('#myCart').text(myShopCount);
//   window.sessionStorage.setItem('shopArray', JSON.stringify(myShopItem));
//   window.sessionStorage.setItem('shopCount', myShopCount);

//   let pay_no = 0;
//   cart_list = ''
//   myShopItem.map(data => {
//     pay_no++
//     cart_list += `
//       <div class="notification_single">
//         <div class="notleft">
//         <div class="notImg">
//           <img src="shop/product/${data.photo}" alt="">
//         </div>
//         </div>
//         <div class="notright">
//           <div>名稱：${data.name}</div>
//           <div>數量：${data.qty}</div>
//           <div>價格：NT$ ${data.total}</div>
//         </div>
//         <div class="notdelete" onclick="order_delete('${pay_no}')"><i class="fa fa-trash-alt trash_hover"></i></div>
//       </div>
//     `
//   })
//   $('#myListContent').html(cart_list);
// }

// 相關
function related(cat){
  // console.log('cat', cat)
  axios.get(`/products/category/${cat}`)
  .then(result=>{
    if (result.data.success == true){
      // console.log(result.data.result)
      result.data.result.map(data=>{
        if(data.no !== itemNo){
          relatedCard += `
            <div class="col-md-3">
              <div class="card mb-4 product-wap rounded-0">
                <div class="card rounded-0">
                  <img class="card-img rounded-0 img-fluid" src="shop/product/${data.photo}">
                  <div class="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
                    <ul class="list-unstyled">
                      <li><a class="btn btn-success text-white" href="shop-single.html?no=${data.no}"><i class="far fa-heart"></i></a></li>
                      <li><a class="btn btn-success text-white mt-2" href="shop-single.html?no=${data.no}"><i class="far fa-eye"></i></a></li>
                      <li><a class="btn btn-success text-white mt-2" onclick="related_cart('${data.no}', '${data.name}', '${data.price}', '${data.photo}')"><i class="fas fa-cart-plus"></i></a></li>
                    </ul>
                  </div>
                </div>
                <div class="card-body">
                  <a href="shop-single.html" class="h3 text-decoration-none">${data.name}</a>
                  <ul class="w-100 list-unstyled d-flex justify-content-between mb-0">
                    <li>${data.description}</li>
                    <li class="pt-2">
                      <span class="product-color-dot color-dot-red float-left rounded-circle ml-1"></span>
                      <span class="product-color-dot color-dot-blue float-left rounded-circle ml-1"></span>
                      <span class="product-color-dot color-dot-black float-left rounded-circle ml-1"></span>
                      <span class="product-color-dot color-dot-light float-left rounded-circle ml-1"></span>
                      <span class="product-color-dot color-dot-green float-left rounded-circle ml-1"></span>
                    </li>
                  </ul>
                  <ul class="list-unstyled d-flex justify-content-center mb-1">
                    <li>
                      ${'<i class="text-warning fa fa-star"></i>'.repeat(data.star)}
                      ${'<i class="text-muted fa fa-star"></i>'.repeat(5 - data.star)}
                    </li>
                  </ul>
                  <p class="text-center mb-0">NT$ ${data.price}</p>
                </div>
              </div>
            </div>
          `
        }
      });
      document.getElementById('related').innerHTML = relatedCard
    } else {
      console.log('查無資料');
    }
  })
  .catch(err =>{
    console.log(err.message);
  })
}

function single_item(no){
  // alert('no', no)
  console.log('no', no)
  sessionStorage.setItem('shop_no', no)
}

function related_cart(cart_no, cart_name, cart_price, cart_photo){
  console.log('cart_no', cart_no);
  console.log('cart_name', cart_name);
  console.log('cart_price', cart_price);
  console.log('cart_photo', cart_photo);
  myShopCount++
  $('#myCart').removeClass('cart_none');
  let myItem = {
    "no": cart_no,
    "name": cart_name,
    "price": parseInt(cart_price),
    "qty": 1,
    "total": cart_price * 1,
    "photo": cart_photo
  }

  myBuyItem.push(myItem)
  window.sessionStorage.setItem('shopArray', JSON.stringify(myBuyItem));
  window.sessionStorage.setItem('shopCount', myShopCount);
  sessionBuyGet = JSON.parse(`${sessionStorage.getItem('shopArray')}`)
  // console.log('sessionBuyGet', sessionBuyGet)
  cart_list = ''
  sessionBuyGet.map(data => {
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
  })
  $('.cart_payBtn').show();
  $('#myListContent').html(cart_list);
  $('#myCart').text(myShopCount);
}